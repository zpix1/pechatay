import os
from json import dump, dumps
from random import randint

BOOKS_DIR = 'texts'
PUBLIC_TEXTS_FILE = os.path.join('..', 'public', 'texts.json') #'../public/texts.json'
PUBLIC_SCHEME_FILE = os.path.join('..', 'public', 'scheme.json') #'../public/texts.json'

VERSION = str(randint(1, 10000))

def format_text(text):
    return list(map(lambda s: s.strip(), text.split('<PAR>')))

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
            title = f.readline().strip()
            author = f.readline().strip()
            text = f.read()
            root.append({
                "id": id,
                "type": "book",
                "title": title,
                "author": author
            })
            textstore.append({
                 "id": id,
                 "text": format_text(text)
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
