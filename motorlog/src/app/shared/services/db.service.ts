import { Injectable } from '@angular/core';
import { USER_SCHEMA } from '@shared/models/user.model';
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxMotorLogDataBase } from 'src/app/RxDB';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { VEHICLE_SCHEMA } from '@shared/models/vehicle.model';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { ConfirmationService } from 'primeng/api'; // Importar el servicio de confirmación

addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

async function createDatabase(): Promise<any> {
  try {
    const db = await createRxDatabase<any>({
      name: 'motorlog-db',
      storage: getRxStorageDexie(),
    });

    await db.addCollections({
      user: { schema: USER_SCHEMA },
      vehicles: { schema: VEHICLE_SCHEMA },
    });

    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    console.log('Se va a eliminar la bd creada...');
    await removeRxDatabase('motorlog-db', getRxStorageDexie());
    const databases = await indexedDB.databases();
    console.log(databases);

    // Recargar la aplicación después de eliminar la base de datos
    // window.location.reload();
    // // Confirmar si se debe eliminar la base de datos
    // confirmationService.confirm({
    //   message: 'Se detectó un problema con la base de datos. ¿Deseas reiniciarla?',
    //   header: 'Confirmación',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: async () => {
    //     console.log('Se va a eliminar la bd creada...');
    //     await removeRxDatabase('motorlog-db', getRxStorageDexie());

    //     // Recargar la aplicación después de eliminar la base de datos
    //     window.location.reload();
    //   },
    //   reject: () => {
    //     console.log('Cancelado');
    //   },
    // });
  }
}

let initState: any;
let DB_INSTANCE: any;

export async function initDatabase() {
  if (!initState) {
    initState = createDatabase().then((db) => {
      DB_INSTANCE = db;
    });
  }
  await initState;
}

@Injectable()
export class DBService {
  get db(): RxMotorLogDataBase {
    return DB_INSTANCE;
  }
}
