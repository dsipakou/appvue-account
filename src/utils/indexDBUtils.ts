const DB_NAME: string = 'indexDB';
const DB_VERSION: number = 1;
let DB: any | null;

export default {
  async getDb(): Promise<any> {
    return new Promise((res, rej) => {
      if (DB) {
        return res(DB);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log('Error opening db', e);
        rej('Error');
      };

      request.onsuccess = (e) => {
        DB = e.target.result;
        res(DB);
      };

      request.onupgradeneeded = (e) => {
        console.log('onupgradeneeded');
        let db = e.target.result;
        let objectStore = db.createObjectStore('userAuth', {
          autoIncrement: true,
          keyPath: 'username',
        });
      };
    });
  },

  async addUser(user) {
    let db = await this.getDb();

    return new Promise((res) => {
      let trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res();
      };

      let store = trans.objectStore("userAuth");

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          if (cursor.value.username != user.username) {
            store.delete(cursor.value.username);
          }
          cursor.continue();
        }
      };
      store.put(user);
    });
  },

  async removeUser(user): Promise {
    if (!user || !user.username) {
      return;
    }
    let db = await this.getDb();

    return new Promise((res) => {
      let trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res();
      };

      let store = trans.objectStore('userAuth');
      store.delete(user.username);
    });
  },

  async getUser() {
    let db = await this.getDb();

    return new Promise((res) => {
      let trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res();
      };

      let user = null;
      let store = trans.objectStore('userAuth');
      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (!cursor) {
          return;
        }
        console.log(cursor.value);
        user = cursor.value;
      };
    });
  },
};
