
class textParser:
    def __init__(self):   

        self.word_bank = {
        'add': '+',
        'plus': '+',
        'subtract': '-',
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
        }

        self.function_bank ={
        'camel' : self.camel_case,
        'snake' : self.snake_case,
        "concat" : self.concat
        }

    def chatgpt(self,arr,idx):
        user_request = arr[idx+1:]

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
        word_list = word_list.split()
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
        print("".join(parsed_code))
        return " ".join(parsed_code)

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