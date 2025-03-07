from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = FastAPI()

@app.get("/fix-code")
async def stream_fixed_code():
    """
    Streams AI response for code fixing request.
    """
    
    def stream_generator():
        # OpenAI Streaming Response
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": "I will give you a string of code, I want you to fix whatever error is in the code. "
                               "For example: for i in rnage(8) give me the fixed version of that line and only that line."
                }
            ],
            stream=True,
        )

        response_text = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                response_text += chunk.choices[0].delta.content
                json_response = json.dumps({"response": response_text})  # Convert to JSON
                yield f"{json_response}\n"  # Send JSON chunks as stream

    return StreamingResponse(stream_generator(), media_type="application/json")

