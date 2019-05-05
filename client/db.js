import Dexie from 'dexie';

const db = new Dexie('clientDB');

db.version(1).stores({
  groups: '++id',
});

export default db;
