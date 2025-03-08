from openai import OpenAI
import os
from dotenv import load_dotenv

class OpenAIChat:


    def __init__(self):
        load_dotenv()  
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError("OPENAI_API_KEY not found. Please set it in your .env file.")

        self.client = OpenAI(api_key=api_key)

 
    def get_fixed_code(self, incorrect_code: str) -> str:
        print(incorrect_code)
        prompt = f"""You are a transcription assistant that converts spoken programming code into written text. 

                    The user will speak code snippets, including punctuation and indentation. 

                    - Convert spoken code into correctly formatted programming syntax.
                    - Maintain proper indentation for Python, JavaScript, and other programming languages.
                    - Convert spoken punctuation like "open parenthesis" to `(`, "close curly brace" to closed curly brace, etc.
                    - Ignore filler words like "uh", "um", or "next line please."
-                   - If the spoken code is ambiguous, infer the most logical syntax.

                    Here is the spoken code: {incorrect_code}

            
            """


        stream = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )

        fixed_code = ""  
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                fixed_code += chunk.choices[0].delta.content  # Append streamed content

        return fixed_code  
 




