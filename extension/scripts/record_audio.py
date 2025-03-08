import sys
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import signal
import threading
import atexit
import traceback
import os
import time
import platform

# Global variables
recording = True
audio_chunks = []
sample_rate = 16000
save_event = threading.Event()

def cleanup():
    global recording
    print("Cleanup called")
    sys.stdout.flush()
    recording = False
    save_event.set()  # Signal to save the recording
    sd.stop()

def signal_handler(signum, frame):
    global recording
    print(f"Signal received: {signum}")
    sys.stdout.flush()
    recording = False
    save_event.set()  # Signal to save the recording
    sd.stop()

def save_recording(audio_chunks, file_path):
    try:
        if not audio_chunks:
            print("No audio data to save")
            sys.stdout.flush()
            return False
            
        print(f"Concatenating {len(audio_chunks)} audio chunks...")
        sys.stdout.flush()
        audio_data = np.concatenate(audio_chunks)
        
        print(f"Saving audio to: {file_path}")
        print(f"Audio data shape: {audio_data.shape}")
        sys.stdout.flush()
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Ensure the data is in the correct format
        if audio_data.dtype != np.int16:
            audio_data = (audio_data * 32767).astype(np.int16)
        
        wav.write(file_path, sample_rate, audio_data)
        
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"Audio saved successfully to {file_path} (size: {size} bytes)")
            sys.stdout.flush()
            return True
        else:
            print(f"Error: File was not created at {file_path}")
            sys.stdout.flush()
            return False
    except Exception as e:
        print(f"Error saving audio: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        sys.stdout.flush()
        return False

def record_audio(file_path):
    global recording, audio_chunks
    
    try:
        # Register cleanup handlers
        atexit.register(cleanup)
        
        # Set up signal handlers based on platform
        if platform.system() != 'Windows':
            signal.signal(signal.SIGINT, signal_handler)
            signal.signal(signal.SIGTERM, signal_handler)
        
        # Test audio device
        try:
            devices = sd.query_devices()
            default_input = sd.query_devices(kind='input')
            print(f"Using input device: {default_input['name']}")
            print(f"Available devices: {devices}")
            sys.stdout.flush()
        except Exception as e:
            print(f"Error querying audio devices: {e}")
            print(f"Traceback: {traceback.format_exc()}")
            sys.stdout.flush()
            return False
        
        # Clear any existing audio chunks
        audio_chunks.clear()
        save_event.clear()
        
        # Start recording
        print("Starting audio recording...")
        sys.stdout.flush()
        
        def audio_callback(indata, frames, time, status):
            try:
                if status:
                    print(f"Status in callback: {status}")
                    sys.stdout.flush()
                if recording:  # Only append while recording
                    audio_chunks.append(indata.copy())
            except Exception as e:
                print(f"Error in audio callback: {e}")
                print(f"Traceback: {traceback.format_exc()}")
                sys.stdout.flush()
        
        # Start the input stream
        with sd.InputStream(
            samplerate=sample_rate,
            channels=1,
            dtype=np.float32,  # Use float32 for better quality
            callback=audio_callback
        ):
            print("Recording in progress...")
            sys.stdout.flush()
            
            # On Windows, we'll use a simple loop that checks a flag
            while recording:
                sd.sleep(100)  # Sleep for 100ms
                
                # Check if we received input on stdin (for Windows)
                if platform.system() == 'Windows':
                    try:
                        if sys.stdin.readable() and len(sys.stdin.read(1)) > 0:
                            print("Stop signal received via stdin")
                            sys.stdout.flush()
                            recording = False
                            break
                    except:
                        pass  # Ignore any stdin errors
        
        print("Recording stopped, processing audio...")
        sys.stdout.flush()
        
        # Save the recording
        return save_recording(audio_chunks, file_path)
            
    except Exception as e:
        print(f"Error in record_audio: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        sys.stdout.flush()
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python record_audio.py <output_file_path>")
        sys.exit(1)
        
    output_file = sys.argv[1]
    print(f"Will save audio to: {output_file}")
    sys.stdout.flush()
    
    try:
        success = record_audio(output_file)
        print(f"Recording completed with success={success}")
        sys.stdout.flush()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"Fatal error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        sys.stdout.flush()
        sys.exit(1)
