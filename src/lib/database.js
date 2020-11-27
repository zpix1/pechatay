class Database {
  static dbName = 'pechatayDB';
  static schemeVersion = 1;
  static dataVersion = NaN;

  constructor() {
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = null;

      let request = indexedDB.open(Database.dbName, Database.version);

      request.onerror = (event) => {
        console.error('IndexDB creation error', event)
        alert('IndexDB error... Maybe your browser is too old?');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        if (localStorage.getItem('pechatayBooksVersion', 0) != Database.dataVersion) {
          fetch('/texts.json')
            .then(r => r.json())
            .then(json => {
              for (let i = 0; i < json.length; i++) {
                const { text, ...other } = json[i];

                let trBook = this.db.transaction('books', 'readwrite');
                let books = trBook.objectStore('books');
                books.add(other);

                let trText = this.db.transaction('bookTexts', 'readwrite');
                let bookTexts = trText.objectStore('bookTexts');
                bookTexts.add({
                  id: other.id,
                  text: text
                });
              }
              resolve();
            }, reject);
          localStorage.setItem('pechatayBooksVersion', Database.dataVersion);
        }
      };

      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('bookTexts')) {
          db.createObjectStore('bookTexts', { keyPath: 'id' });
        }
      }
    });
  }

  async listBooks() {
    return new Promise((resolve, reject) => {
      let tr = this.db.transaction('books', 'readonly');
      let books = tr.objectStore('books');
      let request = books.getAll();

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getBook(id) {
    return new Promise((resolve, reject) => {
      let tr = this.db.transaction(['books'], 'readonly');
      let books = tr.objectStore('books');
      let request = books.get(id);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getBookText(id) {
    return new Promise((resolve, reject) => {
      let tr = this.db.transaction(['bookTexts'], 'readonly');
      let books = tr.objectStore('bookTexts');
      let request = books.get(id);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result.text);
    });
  }
}

export default Database;