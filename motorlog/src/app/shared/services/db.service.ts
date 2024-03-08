import { Injectable } from '@angular/core';
import { USER_SCHEMA } from '@shared/models/user.model';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxMotorLogDataBase } from 'src/app/RxDB';
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';


addRxPlugin(RxDBJsonDumpPlugin);
// para ver errores.
// addRxPlugin(RxDBDevModePlugin);
async function createDatabase(): Promise<any> {
    const db = await createRxDatabase<any>({
        name: 'motorlog-db',
        storage: getRxStorageDexie()
    });
    // create collection
    await db.addCollections({
        user: {
            schema: USER_SCHEMA
        }
    });
    // id: { type: 'string', primary: true, maxLength: 100 },
    // name: { type: 'string' },
    // avatar: { type: 'string' },
    // username: { type: 'string'}

    // const test = await db.user.insert({
    //     id: '1',
    //     name: 'test'
    // });

    // console.log('test', test)

    // const myCollection = db.user;
    // myCollection.exportJSON().then((json: any) => console.dir(json));

    return db;
}

let initState: any;
let DB_INSTANCE: any;

export async function initDatabase() {
    if (!initState) {
        initState = createDatabase().then((db) => (DB_INSTANCE = db));
    }
    await initState;
}

@Injectable()
export class DBService {
    get db(): RxMotorLogDataBase {
        return DB_INSTANCE;
    }
}
