"""
ct2-transformers-converter --model openai/whisper-medium --output_dir whisper-medium-ct2 --copy_files tokenizer.json preprocessor_config.json --quantization float16

DOWNLOAD THIS: (Insert into terminal)
ct2-transformers-converter --model openai/whisper-medium --output_dir whisper-medium-ct2 --copy_files tokenizer.json preprocessor_config.json --quantization int8


"""
"""PyAudio Example: Play a wave file."""
import wave
import pyaudio
import keyboard
import time
from parser import textParser
import re
class audioRecorder:
    def __init__(self):
        self.file_name = "temp_recordings/voice_audio.wav"
        self.chunk = 1024
        self.FORMAT = pyaudio.paInt16
        self.sample_rate = 44100
        self.p = pyaudio.PyAudio()
        self.itteration = 0
    def terminate_all(self):
        self.p.terminate()


    def record(self):
        stream = self.p.open(
            format=self.FORMAT,
            channels=1,
            rate=self.sample_rate,
            input=True,
            output=True,
            frames_per_buffer=self.chunk
            )
        
        
        frames = []
        max_time = 20
        print('hold space to start')

        while True:
            flag = False
            starting_time = time.time()
            while keyboard.is_pressed('space') :
                curr_time = time.time()
                if curr_time - starting_time >= max_time:
                    break
                data = stream.read(self.chunk)
                frames.append(data)
                flag = True

            if flag: 
                break
            
        curr_file_name = f"temp_recordings/voice_audio{self.itteration}.wav"
        self.itteration+=1
        with wave.open(curr_file_name, 'wb') as wf:
            wf.setnchannels(1)  # Mono audio
            wf.setsampwidth(self.p.get_sample_size(self.FORMAT))
            wf.setframerate(self.sample_rate)
            wf.writeframes(b''.join(frames))  # Write the frames to the file
        print("Finished recording.")

        # stop and close stream
        stream.stop_stream()
        stream.close()

test_recorder = audioRecorder()

for _ in range(3):
    test_recorder.record()