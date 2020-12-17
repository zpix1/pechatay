import {publicPath} from "@/../vue.config";
class Database {
  static dbName = "pechatayDB";
  static localStorageSchemeKey = "pechatayBooksScheme";
  static localStorageSettingsKeyPrefix = "pechataySettings_";
  static localStorageBookKeyPrefix = "pechatayBook_";

  static schemeVersion = 1;

  constructor() {
    console.log("DB Created");
    this.db = null;
    this.scheme = null;
    this.id2book = {};
  }

  generateId2book(scheme) {
    if (scheme.type === "set") {
      for (let i = 0; i < scheme.items.length; i++) {
        this.generateId2book(scheme.items[i]);
      }
    } else {
      let userBook = this.getBook(scheme.id);
      this.setBook(scheme.id, {
        ...scheme,
        userData: (userBook ? userBook.userData || {} : {})
      });
    }
  }

  init() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(publicPath + "scheme.json")
          .then(r => r.json())
          .then(json => {
            this.scheme = json;

            let request = indexedDB.open(Database.dbName, Database.version);

            request.onerror = (event) => {
              console.error("IndexDB creation error", event);
              alert("IndexDB error... Maybe your browser is too old?");
            };

            request.onsuccess = (event) => {
              this.db = event.target.result;
              if (localStorage.getItem(Database.localStorageSchemeKey) !== JSON.stringify(json)) {
                this.generateId2book(json);
                console.log("pechatayBooksScheme updated, loading texts json");
                fetch(publicPath + "texts.json")
                  .then(r => r.json())
                  .then(json => {
                    for (let i = 0; i < json.length; i++) {
                      const {text, ...other} = json[i];
                      let tr = this.db.transaction("bookTexts", "readwrite");
                      let bookTexts = tr.objectStore("bookTexts");
                      bookTexts.put({
                        id: other.id,
                        text: text
                      });
                    }
                    resolve();
                  }, reject);
                localStorage.setItem(Database.localStorageSchemeKey, JSON.stringify(json));
              } else {
                resolve();
              }
            };

            request.onupgradeneeded = (event) => {
              let db = event.target.result;
              if (!db.objectStoreNames.contains("bookTexts")) {
                db.createObjectStore("bookTexts", {keyPath: "id"});
              }
            };
          });
      }, 0);
    });
  }

  getScheme() {
    return this.scheme;
  }

  getSettingsValue(key) {
    return JSON.parse(localStorage.getItem(Database.localStorageSettingsKeyPrefix + key));
  }

  setSettingsValue(key, value) {
    return localStorage.setItem(Database.localStorageSettingsKeyPrefix + key, JSON.stringify(value));
  }

  getBook(id) {
    return JSON.parse(localStorage.getItem(Database.localStorageBookKeyPrefix + id));
    // return this.id2book[id] || null;
    // return new Promise((resolve, reject) => {
    //   let tr = this.db.transaction(['texts'], 'readonly');
    //   let texts = tr.objectStore('texts');
    //   let request = texts.get(id);

    //   request.onerror = reject;
    //   request.onsuccess = () => resolve(request.result);
    // });
  }

  setBook(id, book) {
    localStorage.setItem(Database.localStorageBookKeyPrefix + id, JSON.stringify(book));
  }

  // saveId2book() {
  //   localStorage.setItem(Database.localStorageId2bookKey, JSON.stringify(this.id2book));
  // }

  // setBookUserData(id, userData) {
  //   this.id2book[id].userData = userData;
  // }

  async getBookText(id) {
    return new Promise((resolve, reject) => {
      let tr = this.db.transaction(["bookTexts"], "readonly");
      let books = tr.objectStore("bookTexts");
      let request = books.get(id);

      request.onerror = reject;
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.text);
        } else {
          reject();
        }
      };
    });
  }
}

export default Database;