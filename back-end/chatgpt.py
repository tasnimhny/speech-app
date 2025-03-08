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
        prompt = f"""
            The following Python code contains an error:
            {incorrect_code}

            Fix the error and return only the corrected line. Do not include explanations or any additional text.
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
 
    def turn_python(self, code, command):
        prompt = f"""
            Turn The following prompt into python and follow the users request: {command}
            Here is the code: {code}
        """
        stream = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        
        fixed_code = [] 
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                fixed_code.append(chunk.choices[0].delta.content)  # Append streamed content

        return "".join(fixed_code)  

