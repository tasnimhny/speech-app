from faster_whisper import WhisperModel
"""
ct2-transformers-converter --model openai/whisper-medium --output_dir whisper-medium-ct2 --copy_files tokenizer.json preprocessor_config.json --quantization float16

ct2-transformers-converter --model openai/whisper-medium --output_dir whisper-medium-ct2 --copy_files tokenizer.json preprocessor_config.json --quantization int8


"""
"""PyAudio Example: Play a wave file."""
import wave
import sys
import pyaudio
import keyboard
import time


class whisperModel:
    def __init__(self):
        #model_size = "medium"
        model_size= "whisper-medium-ct2"
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        #optional
        self.audio_path = "voice_audio.wav"
        """
        other models:
        
        model = WhisperModel(small, device="cuda", compute_type="float16")
        model = WhisperModel(base, device="cpu", compute_type="int8")
        model = WhisperModel(large, device="cpu", compute_type="int8")

        """

    def process_file(self, file):
        
        segments, info = self.mode.transcribe(file,beam_size=5)
        audio_text = []
        for segment in segments:
            audio_text.append(segment.text)
        return audio_text
            
    def get_text(self):
        segments, info = self.model.transcribe(self.audio_path, beam_size=5)
        audio_text = []
        for segment in segments:
            print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
            audio_text.append(segment.text)
        return audio_text
       
      
class audioRecorder:
    def __init__(self):
        self.file_name = "voice_audio.wav"
        self.chunk = 1024
        self.FORMAT = pyaudio.paInt16
        self.sample_rate = 44100
        self.p = pyaudio.PyAudio()

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
            

        with wave.open(self.file_name, 'wb') as wf:
            wf.setnchannels(1)  # Mono audio
            wf.setsampwidth(self.p.get_sample_size(self.FORMAT))
            wf.setframerate(self.sample_rate)
            wf.writeframes(b''.join(frames))  # Write the frames to the file
        print("Finished recording.")

        # stop and close stream
        stream.stop_stream()
        stream.close()

print('starting...')
test_model = whisperModel()
test_recorder = audioRecorder() 

for _ in range(1):
    test_recorder.record()
    print(test_model.get_text())