from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
import aiofiles
#pip install aiofiles
#pip install python-multipart
from voiceTranscription import whisperModel
from parser import textParser

#to run:
#uvicorn fast:app --reload

text_parser = textParser()
#text_parer.parse()
transcription_model = whisperModel()
#transcription_model.process_file(file_path)


app = FastAPI()

# where audio stored
FILE_NAME = "audio_file.wav"
file_location = os.path.join(os.getcwd(), FILE_NAME)

#some guy on youtube uses whisper and also sends audio files
#https://www.youtube.com/watch?v=vTmkBExkTbU
@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to the server
        file_path = f"./uploads/{file.filename}"

        # Ensure the 'uploads' directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the file asynchronously
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # Use Whisper to transcribe the audio file
        transcription, pre_process_transcription = transcription_model.process_file(file_path)

        # Parse the transcription (using textParser)
        if transcription[0] =='go' or transcription[0] == 'delete':
            print(transcription)
            transcription = " ".join(transcription)
            return JSONResponse(content={"original_transcription": pre_process_transcription, "parsed_transcription": transcription})
        
        # This goes to chatgpt
        parsed_transcription = text_parser.parse(transcription)

        # Return the parsed transcription as a JSON response
        return JSONResponse(content={"original_transcription": pre_process_transcription, "parsed_transcription": parsed_transcription})

    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})


@app.get("/")
async def read_root():
    return {"message": "Hello World"}