class Database {
  static dbName = 'pechatayDB';
  static schemeVersion = 1;
  static dataVersion = 1;

  constructor() {
    this.db = null;

    let request = indexedDB.open(Database.dbName, Database.version);

    request.onerror = (event) => {
      console.error('IndexDB creation error', event)
      alert('IndexDB error... Maybe your browser is too old?');
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      if (localStorage.getItem('pechatayBooksVersion', 0) != Database.dataVersion) {
        fetch('texts.json')
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
          });
      }
    };

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      console.log(db.objectStoreNames);
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('bookTexts')) {
        db.createObjectStore('bookTexts', { keyPath: 'id' });
      }
    }
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
}

export default Database;