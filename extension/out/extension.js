"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const os = require("os");
// Create output channel
const outputChannel = vscode.window.createOutputChannel("Voice to Code");
class VoiceRecorderViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'startRecording':
                    await this.startRecording();
                    break;
                case 'stopRecording':
                    await this.stopRecording();
                    break;
                case 'log':
                    outputChannel.appendLine(`Webview: ${message.text}`);
                    break;
            }
        });
    }
    async startRecording() {
        if (!this._view)
            return;
        try {
            // Create audio directory if it doesn't exist
            const audioDir = path.join(this._extensionUri.fsPath, 'audio');
            if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true });
            }
            // Generate unique filename
            this.currentAudioFile = path.join(audioDir, `recording_${Date.now()}.wav`);
            // Get path to Python script
            const scriptPath = path.join(this._extensionUri.fsPath, 'scripts', 'record_audio.py');
            outputChannel.appendLine(`Starting recording process...`);
            outputChannel.appendLine(`Script path: ${scriptPath}`);
            outputChannel.appendLine(`Output file: ${this.currentAudioFile}`);
            // Start Python recording process
            this.pythonProcess = cp.spawn('python', [scriptPath, this.currentAudioFile], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            // Handle process output
            this.pythonProcess.stdout?.on('data', (data) => {
                outputChannel.appendLine(`Python stdout: ${data}`);
            });
            this.pythonProcess.stderr?.on('data', (data) => {
                outputChannel.appendLine(`Python stderr: ${data}`);
            });
            this.pythonProcess.on('error', (error) => {
                outputChannel.appendLine(`Python process error: ${error.message}`);
                this._view?.webview.postMessage({
                    command: 'updateStatus',
                    text: `Error: ${error.message}`
                });
            });
            this._view.webview.postMessage({
                command: 'updateStatus',
                text: 'Recording started'
            });
            outputChannel.appendLine('Recording started');
        }
        catch (error) {
            outputChannel.appendLine(`Error starting recording: ${error}`);
            this._view.webview.postMessage({
                command: 'updateStatus',
                text: `Error starting recording: ${error}`
            });
        }
    }
    async stopRecording() {
        if (!this._view || !this.pythonProcess)
            return;
        try {
            outputChannel.appendLine('Stopping recording...');
            if (os.platform() === 'win32') {
                // On Windows, write to stdin to signal stop
                if (this.pythonProcess.stdin) {
                    this.pythonProcess.stdin.write('\n');
                    this.pythonProcess.stdin.end();
                }
            }
            else {
                // On Unix-like systems, use SIGINT
                this.pythonProcess.kill('SIGINT');
            }
            // Wait for process to finish with a timeout
            await Promise.race([
                new Promise((resolve, reject) => {
                    this.pythonProcess?.on('close', (code) => {
                        outputChannel.appendLine(`Python process exited with code ${code}`);
                        resolve();
                    });
                    this.pythonProcess?.on('error', (err) => {
                        reject(err);
                    });
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Process timeout')), 5000))
            ]);
            // Give the file system a moment to finish writing
            await new Promise(resolve => setTimeout(resolve, 500));
            if (this.currentAudioFile && fs.existsSync(this.currentAudioFile)) {
                const stats = fs.statSync(this.currentAudioFile);
                outputChannel.appendLine(`Recording saved: ${this.currentAudioFile} (${stats.size} bytes)`);
                this._view.webview.postMessage({
                    command: 'updateStatus',
                    text: 'Recording saved successfully'
                });
            }
            else {
                throw new Error('Recording file not found');
            }
        }
        catch (error) {
            outputChannel.appendLine(`Error stopping recording: ${error}`);
            this._view.webview.postMessage({
                command: 'updateStatus',
                text: `Error stopping recording: ${error}`
            });
        }
        finally {
            if (this.pythonProcess) {
                try {
                    // Force kill if still running
                    this.pythonProcess.kill('SIGKILL');
                }
                catch (e) {
                    // Ignore kill errors
                }
            }
            this.pythonProcess = undefined;
            this.currentAudioFile = undefined;
        }
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Voice Recorder</title>
        <style>
            body {
                padding: 10px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
                background-color: var(--vscode-editor-background);
            }
            .recording-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #ff0000;
                margin-bottom: 1rem;
                display: none;
            }
            .recording .recording-indicator {
                display: block;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            .status {
                margin: 10px 0;
                font-size: 12px;
            }
            .button-container {
                display: flex;
                gap: 8px;
                margin: 10px 0;
            }
            button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: none;
                padding: 4px 8px;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                cursor: pointer;
            }
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            button:not(:disabled):hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .debug-info {
                margin-top: 10px;
                font-size: 11px;
                color: var(--vscode-descriptionForeground);
                white-space: pre-wrap;
                max-height: 200px;
                overflow-y: auto;
            }
        </style>
    </head>
    <body>
        <div class="recording-indicator"></div>
        <div class="status">Ready to record</div>
        <div class="button-container">
            <button id="startButton">
                <span class="codicon codicon-record"></span>
                Start Recording
            </button>
            <button id="stopButton" disabled>
                <span class="codicon codicon-debug-stop"></span>
                Stop Recording
            </button>
        </div>
        <div class="debug-info"></div>

        <script>
            const vscode = acquireVsCodeApi();
            const startButton = document.getElementById('startButton');
            const stopButton = document.getElementById('stopButton');
            const status = document.querySelector('.status');
            const debugInfo = document.querySelector('.debug-info');
            const body = document.body;

            function log(message) {
                const timestamp = new Date().toLocaleTimeString();
                debugInfo.textContent += \`[\${timestamp}] \${message}\\n\`;
                debugInfo.scrollTop = debugInfo.scrollHeight;
                vscode.postMessage({ command: 'log', text: message });
            }

            startButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'startRecording' });
                startButton.disabled = true;
                stopButton.disabled = false;
                body.classList.add('recording');
            });

            stopButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'stopRecording' });
                startButton.disabled = false;
                stopButton.disabled = true;
                body.classList.remove('recording');
            });

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'updateStatus':
                        status.textContent = message.text;
                        log(message.text);
                        break;
                }
            });
        </script>
    </body>
    </html>`;
    }
}
VoiceRecorderViewProvider.viewType = 'voiceRecorder';
function activate(context) {
    console.log('Voice to Code extension is now active');
    // Register the custom sidebar view provider
    const provider = new VoiceRecorderViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(VoiceRecorderViewProvider.viewType, provider));
    // Register commands
    let startCommand = vscode.commands.registerCommand('voice-to-code.startVoiceCommand', () => {
        vscode.commands.executeCommand('voice-to-code.focus');
    });
    context.subscriptions.push(startCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map