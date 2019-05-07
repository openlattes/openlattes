import Dexie from 'dexie';

const db = new Dexie('clientDB');

db.version(1).stores({
  groups: '++id,name',
});

export default db;
