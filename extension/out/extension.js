"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const axios_1 = require("axios");
// Configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Update with your actual backend URL
function activate(context) {
    console.log('Voice to Code extension is now active');
    // Register the startVoiceCommand command
    let startVoiceCommandDisposable = vscode.commands.registerCommand('voice-to-code.startVoiceCommand', async () => {
        // Check if user is logged in
        const token = context.globalState.get('authToken');
        if (!token) {
            const loginFirst = await vscode.window.showInformationMessage('You need to login first to use Voice to Code', 'Login');
            if (loginFirst === 'Login') {
                vscode.commands.executeCommand('voice-to-code.login');
            }
            return;
        }
        // Start recording
        vscode.window.showInformationMessage('Starting voice recording...');
        try {
            const transcription = await recordAndTranscribe();
            if (!transcription) {
                vscode.window.showErrorMessage('Failed to transcribe voice command');
                return;
            }
            // Check if LLM enhancement is requested
            if (transcription.includes('LLM')) {
                await handleLLMEnhancement(transcription, token);
            }
            else {
                // Process regular voice command
                const processedCode = processVoiceCommand(transcription);
                insertCodeIntoEditor(processedCode);
                // Log usage
                await logUsage(token, 'voice-to-code', transcription.length);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    // Register login command
    let loginDisposable = vscode.commands.registerCommand('voice-to-code.login', async () => {
        const username = await vscode.window.showInputBox({
            prompt: 'Enter your username',
            placeHolder: 'Username'
        });
        if (!username)
            return;
        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true,
            placeHolder: 'Password'
        });
        if (!password)
            return;
        try {
            const response = await axios_1.default.post(`${API_BASE_URL}/login`, {
                username,
                password
            });
            if (response.data.token) {
                await context.globalState.update('authToken', response.data.token);
                await context.globalState.update('username', username);
                vscode.window.showInformationMessage(`Logged in as ${username}`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage('Login failed. Please check your credentials.');
        }
    });
    // Register logout command
    let logoutDisposable = vscode.commands.registerCommand('voice-to-code.logout', async () => {
        await context.globalState.update('authToken', undefined);
        await context.globalState.update('username', undefined);
        vscode.window.showInformationMessage('Logged out successfully');
    });
    context.subscriptions.push(startVoiceCommandDisposable, loginDisposable, logoutDisposable);
}
exports.activate = activate;
// Record audio and transcribe using faster-whisper
async function recordAndTranscribe() {
    return new Promise((resolve, reject) => {
        // Create a temporary file for the audio
        const tempDir = os.tmpdir();
        const audioFilePath = path.join(tempDir, `voice_command_${Date.now()}.wav`);
        // Show a progress notification
        const recordingStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        recordingStatus.text = "$(mic) Recording...";
        recordingStatus.show();
        // Start the Python script for recording and transcription
        const pythonPath = getPythonPath();
        const scriptPath = path.join(__dirname, '..', 'scripts', 'speech_to_text.py');
        // Ensure the script directory exists
        const scriptDir = path.dirname(scriptPath);
        if (!fs.existsSync(scriptDir)) {
            fs.mkdirSync(scriptDir, { recursive: true });
        }
        // Create the Python script if it doesn't exist
        if (!fs.existsSync(scriptPath)) {
            createSpeechToTextScript(scriptPath);
        }
        const process = cp.spawn(pythonPath, [scriptPath, audioFilePath]);
        let output = '';
        let errorOutput = '';
        process.stdout.on('data', (data) => {
            output += data.toString();
        });
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error('Speech-to-text error:', data.toString());
        });
        process.on('close', (code) => {
            recordingStatus.dispose();
            if (code === 0 && output.trim()) {
                // Clean up the audio file
                try {
                    fs.unlinkSync(audioFilePath);
                }
                catch (err) {
                    console.error('Failed to delete temporary audio file:', err);
                }
                resolve(output.trim());
            }
            else {
                reject(new Error(`Process exited with code ${code}. Error: ${errorOutput}`));
            }
        });
        // Allow user to stop recording with Escape key
        const disposable = vscode.commands.registerCommand('type', (args) => {
            if (args.text === 'Escape') {
                process.kill();
                recordingStatus.dispose();
                disposable.dispose();
                reject(new Error('Recording cancelled by user'));
            }
        });
    });
}
// Process voice command into code
function processVoiceCommand(transcription) {
    // Replace voice command keywords with actual code syntax
    let processedCode = transcription;
    // Basic replacements based on the keyword list in the PRD
    const replacements = [
        [/equals|is equal to/gi, '='],
        [/colon/gi, ':'],
        [/dash/gi, '-'],
        [/plus/gi, '+'],
        [/minus/gi, '-'],
        [/times|multiply/gi, '*'],
        [/divided by/gi, '/'],
        [/mod/gi, '%'],
        [/power|to the power of/gi, '**'],
        [/greater than or equal to/gi, '>='],
        [/less than or equal to/gi, '<='],
        [/greater than/gi, '>'],
        [/less than/gi, '<'],
        [/not equal to/gi, '!='],
        [/print/gi, 'print'],
        [/if condition/gi, 'if '],
        [/else if|elif/gi, 'elif '],
        [/else/gi, 'else'],
        [/for loop/gi, 'for i in range'],
        [/while loop/gi, 'while '],
        [/comment/gi, '# '],
        [/return/gi, 'return '],
    ];
    // Apply all replacements
    for (const [pattern, replacement] of replacements) {
        processedCode = processedCode.replace(pattern, replacement);
    }
    // Handle special commands
    // Convert to camel case
    const camelCaseMatch = processedCode.match(/convert to camel case ([a-zA-Z0-9_\s]+)/i);
    if (camelCaseMatch && camelCaseMatch[1]) {
        const words = camelCaseMatch[1].trim().split(/\s+/);
        const camelCase = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        processedCode = processedCode.replace(camelCaseMatch[0], camelCase);
    }
    // Convert to snake case
    const snakeCaseMatch = processedCode.match(/convert to snake case ([a-zA-Z0-9_\s]+)/i);
    if (snakeCaseMatch && snakeCaseMatch[1]) {
        const snakeCase = snakeCaseMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
        processedCode = processedCode.replace(snakeCaseMatch[0], snakeCase);
    }
    // Handle concatenation
    const concatMatch = processedCode.match(/concatenate (.*?) concatenate/i);
    if (concatMatch && concatMatch[1]) {
        const concatenated = concatMatch[1].replace(/\s+/g, '');
        processedCode = processedCode.replace(concatMatch[0], concatenated);
    }
    // Handle function definition
    if (processedCode.includes('define function')) {
        processedCode = processedCode.replace(/define function\s+([a-zA-Z0-9_]+)/i, 'def $1():');
    }
    // Handle import statements
    const importMatch = processedCode.match(/import ([a-zA-Z0-9_]+)/i);
    if (importMatch && importMatch[1]) {
        processedCode = `import ${importMatch[1]}`;
    }
    return processedCode;
}
// Insert code into the active editor
function insertCodeIntoEditor(code) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }
    const selection = editor.selection;
    editor.edit(editBuilder => {
        editBuilder.replace(selection, code);
    });
}
// Handle LLM enhancement request
async function handleLLMEnhancement(transcription, token) {
    // Remove the LLM keyword
    const prompt = transcription.replace(/LLM/gi, '').trim();
    // Show progress
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Processing with LLM",
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0 });
        try {
            // Call the LLM API
            const response = await axios_1.default.post(`${API_BASE_URL}/llm`, { prompt }, { headers: { Authorization: `Bearer ${token}` } });
            progress.report({ increment: 100 });
            if (response.data && response.data.code) {
                // Insert the enhanced code
                insertCodeIntoEditor(response.data.code);
                // Log LLM usage
                await logUsage(token, 'llm-enhance', prompt.length);
            }
            else {
                vscode.window.showErrorMessage('LLM returned an invalid response');
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`LLM enhancement failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
// Log usage to the backend
async function logUsage(token, feature, codeLength) {
    try {
        await axios_1.default.post(`${API_BASE_URL}/usage`, {
            feature,
            codeLength,
            timestamp: new Date().toISOString()
        }, { headers: { Authorization: `Bearer ${token}` } });
    }
    catch (error) {
        console.error('Failed to log usage:', error);
    }
}
// Get Python path
function getPythonPath() {
    // Try to get Python path from settings
    const pythonConfig = vscode.workspace.getConfiguration('python');
    const configuredPath = pythonConfig.get('defaultInterpreterPath');
    if (configuredPath && fs.existsSync(configuredPath)) {
        return configuredPath;
    }
    // Fallback to system Python
    return os.platform() === 'win32' ? 'python' : 'python3';
}
// Create the speech-to-text Python script
function createSpeechToTextScript(scriptPath) {
    const scriptContent = `
  import sys
  import os
  import time
  import sounddevice as sd
  import numpy as np
  import scipy.io.wavfile as wav
  from faster_whisper import WhisperModel
  
  def record_audio(file_path, duration=5, sample_rate=16000):
      print("Recording... Press Ctrl+C to stop.")
      try:
          audio_data = sd.rec(
              int(duration * sample_rate),
              samplerate=sample_rate,
              channels=1,
              dtype='int16'
          )
          
          # Wait for recording to complete or for user to stop it
          for _ in range(duration):
              sd.sleep(1000)  # Sleep for 1 second
              if not sd.wait():  # Check if recording is still active
                  break
                  
          sd.stop()
          
          # Save the recorded audio to a WAV file
          wav.write(file_path, sample_rate, audio_data)
          print(f"Audio saved to {file_path}")
          return True
      except KeyboardInterrupt:
          sd.stop()
          print("Recording stopped by user")
          return True
      except Exception as e:
          print(f"Error recording audio: {e}")
          return False
  
  def transcribe_audio(file_path):
      try:
          # Load the Whisper model
          model_size = "base"
          model = WhisperModel(model_size, device="cpu", compute_type="int8")
          
          # Transcribe the audio
          segments, info = model.transcribe(file_path, beam_size=5)
          
          # Combine all segments into a single transcript
          transcript = " ".join([segment.text for segment in segments])
          
          return transcript
      except Exception as e:
          print(f"Error transcribing audio: {e}")
          return None
  
  if __name__ == "__main__":
      if len(sys.argv) < 2:
          print("Usage: python speech_to_text.py <output_file_path>")
          sys.exit(1)
          
      output_file = sys.argv[1]
      
      # Record audio
      if record_audio(output_file, duration=10):
          # Transcribe the recorded audio
          transcript = transcribe_audio(output_file)
          
          if transcript:
              print(transcript)
          else:
              print("Failed to transcribe audio")
              sys.exit(1)
      else:
          print("Failed to record audio")
          sys.exit(1)
  `;
    fs.writeFileSync(scriptPath, scriptContent);
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map