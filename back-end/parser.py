from chatgpt import OpenAIChat
class textParser:
    def __init__(self):   
        self.open_model = OpenAIChat()
        self.word_bank = {
        'add': '+',
        'plus': '+',
        'subtract': '-',
        'equals': '=',
        'divide': '/',
        'multiply': '*',
        'power': '**',
        'times': 'x',
        "greater than": '>',
        "less than": '<',
        "greater than or equal": '>=',
        "less than or equal" :"<=",
        "l l m" : self.chatgpt,
        "llm" : self.chatgpt,
        'not' : '!',
        "notequal" : '!=',
        'equal' : '=',
        'function' : 'def',
        "elseif": 'elif',
        "comment" :'#',
        'hashtag' :'#',
        'colon' : ':',
        'dash' : '-',
        'mod' : '%',
        'true' : 'True',
        }


        self.function_bank ={
        'camel' : self.camel_case,
        'snake' : self.snake_case,
        "concat" : self.concat,
        "string" : self.create_str
        }

    def chatgpt(self,arr,idx):
        user_prompt = "".join(arr[idx+1:])
        python_code = "".join(arr[:idx])
        self.open_model.add_user_request(python_code, user_prompt)
    
    def create_str(self,arr, starting_idx):
        word_combine = []
        for i in range(starting_idx+1, len(arr)):
            curr_word = arr[i]
            if curr_word == "string":
                word_combine[0] = "\'" + word_combine[0]
                word_combine[-1] = word_combine[-1] + "\'"
                return [" ".join(word_combine), i]
            word_combine.append(curr_word)
        return 
        

    def camel_case(self,arr, start):
        word_combine = []
        for idx in range(start+1, len(arr)):
            curr_word = arr[idx]
            if curr_word == 'camel':
                word_combine[0] = word_combine[0].lower()
                phrase = "".join(word_combine)
                return [phrase, idx]
            word_combine.append(curr_word.capitalize())
        return ""

    def snake_case (self,arr,start):
        word_combine = []
        for idx in range(start+1, len(arr)):
            curr_word = arr[idx]
            if curr_word == 'snake':
                phrase = "_".join(word_combine)
                return [phrase, idx]
            word_combine.append(curr_word)
        return ""
    
    def concat(self,arr, start_idx):
        concat_arr = []

        for idx in range(start_idx+1, len(arr)):
            curr_word = arr[idx]
            arr[idx] = ""
            if curr_word == 'concat':
                phrase = "".join(concat_arr)
                if phrase in self.word_bank:
                    phrase = self.word_bank[phrase]
                return [phrase,idx]
            if curr_word in self.word_bank:
                curr_word = self.word_bank[curr_word]
            concat_arr.append(curr_word)
        return ""

    

    def parse(self,word_list):
        parsed_code = []
        i = 0
        while i < len(word_list):
            word = word_list[i]
            curr = word
            if word in self.word_bank:
                curr = self.word_bank[word]
            elif word in self.function_bank:
                curr,end_idx = self.function_bank[word](word_list,i)
                i = end_idx
            i+=1
            parsed_code.append(curr)
        
        python_code = "".join(parsed_code)
        finalized_code = self.open_model.get_fixed_code(python_code)
        return finalized_code

"""    
temp = textParser()

test1 = "camel one two three camel"
temp.parse(test1)
print()

test2 = "snake one two three snake"
temp.parse(test2)
print()

test3 = "1 plus 1"
temp.parse(test3)

test4 = 'camel one two camel equal 4'
print(temp.parse(test4))
"""