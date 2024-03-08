import { Injectable } from '@angular/core';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

async function createDatabase(): Promise<any> {
    const db = await createRxDatabase<any>({
        name: 'motorLog-db',
        storage: getRxStorageDexie()
    });
    // create collection
    await db.addCollections({
      user:{
        schema:"USER_SCHEMA"
      }
    })

    return db;
}

@Injectable()
export class DBService {}
