const DB_NAME: string = 'indexDB';
const DB_VERSION: number = 1;
let DB: any | null;

export interface User {
  email: string,
  token: string,
  username: string,
}

export default {
  async getDb(): Promise<any> {
    return new Promise((res, rej) => {
      if (DB) {
        return res(DB);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log('Error opening db', e);
        rej(new Error('Error'));
      };

      request.onsuccess = (e) => {
        const target = e.target as IDBOpenDBRequest;
        DB = target.result;
        res(DB);
      };

      request.onupgradeneeded = (e) => {
        console.log('onupgradeneeded');
        const target = e.target as IDBOpenDBRequest;
        const db = target.result;
        const objectStore = db.createObjectStore('userAuth', {
          autoIncrement: true,
          keyPath: 'email',
        });
      };

      return null;
    });
  },

  async addUser(user: User): Promise<any> {
    const db = await this.getDb();

    return new Promise((res) => {
      const trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res(null);
      };

      const store = trans.objectStore('userAuth');

      store.openCursor().onsuccess = (e: any) => {
        const target = e.target as IDBRequest;
        const cursor = target.result;
        if (cursor) {
          if (cursor.value.email === user.email) {
            store.delete(cursor.value.email);
          }
          cursor.continue();
        }
      };
      store.put(user);
    });
  },

  async removeUser(user: User): Promise<any> {
    if (!user?.email) {
      return false;
    }
    const db = await this.getDb();

    return new Promise((res) => {
      const trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res(null);
      };

      const store = trans.objectStore('userAuth');
      store.delete(user.email);
    });
  },

  async getUser(): Promise<any> {
    const db = await this.getDb();

    return new Promise((res) => {
      const trans = db.transaction(['userAuth'], 'readwrite');
      trans.oncomplete = () => {
        res(null);
      };

      let user = null;
      const store = trans.objectStore('userAuth');
      store.openCursor().onsuccess = (e: any) => {
        const target = e.target as IDBRequest;
        const cursor = target.result;
        if (!cursor) {
          return;
        }
        user = cursor.value;
        res(user);
      };
    });
  },
};
