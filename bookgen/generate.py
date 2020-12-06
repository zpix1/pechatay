import os
from json import dump, dumps, loads
from random import randint
from textwrap import wrap

BOOKS_DIR = 'texts'
PUBLIC_TEXTS_FILE = os.path.join('..', 'public', 'texts.json') #'../public/texts.json'
PUBLIC_SCHEME_FILE = os.path.join('..', 'public', 'scheme.json') #'../public/texts.json'

VERSION = str(randint(1, 10000))

def format_text(text, sep):
    text = text.replace('ё', 'е')
    text_list = list(map(lambda s: s.strip(), text.split(sep)))
    ans_list = []
    for par in text_list:
        if len(par) > 1000:
            ans_list += wrap(par, width=500)
            print("WARN: Too big par: ", len(par), ", wrapped.")
        else:
            ans_list += [par]
    return ans_list


def get_book_set(root, pre, textstore):
    for name in os.listdir(os.path.join(*pre)):
        if os.path.isdir(os.path.join(*pre, name)):
            items = []
            get_book_set(items, pre + [name], textstore)
            root.append({
                "type": "set",
                "title": name,
                "items": items
            })
        else:
            f = open(os.path.join(*pre, name))
            id = name.replace('.txt', '')
            data = loads(f.readline().strip())

            text = f.read()
            root.append({
                "id": id,
                "type": "book",
                "title": data["title"],
                "author": data["author"]
            })
            textstore.append({
                 "id": id,
                 "text": format_text(text, data["sep"])
            })

root = {
    "type": "set",
    "title": "All",
    "version": VERSION,
    "items": []
}

textstore = []

get_book_set(root["items"], [BOOKS_DIR], textstore)

# print(dumps(root, indent=4, ensure_ascii=False))
# print(dumps(textstore, indent=4, ensure_ascii=False))

with open(PUBLIC_SCHEME_FILE, 'w') as f:
    dump(root, f, indent=4, ensure_ascii=False)
with open(PUBLIC_TEXTS_FILE, 'w') as f:
    dump(textstore, f, indent=4, ensure_ascii=False)

print("Generation completed, found {} texts".format(len(textstore)))
