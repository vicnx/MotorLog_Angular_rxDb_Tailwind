import { Injectable, inject } from '@angular/core';
import { DBService } from './db.service';
import { RxCollection } from 'rxdb';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class DataExportImportService {

  dbSvc = inject(DBService);

  public async exportData(): Promise<void> {
    try {
      const db = this.dbSvc.db;
      const collections = Object.keys(db.collections);

      const dataToExport: Record<string, any[]> = {};

      for (const collectionName of collections) {
        const collection = db.collections[collectionName as keyof typeof db.collections] as unknown as RxCollection<any>;
        const allDocs = await collection.find().exec();
        dataToExport[collectionName] = allDocs.map(doc => doc.toJSON());
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      saveAs(blob, 'motorLog_backup.json');
      console.log('Datos exportados exitosamente.');
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  }

  public async importData(file: File): Promise<void> {
    try {
      const db = this.dbSvc.db;
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent);

      for (const collectionName of Object.keys(importedData)) {
        const collection = db.collections[collectionName as keyof typeof db.collections] as unknown as RxCollection<any>;
        for (const docData of importedData[collectionName]) {
          await collection.upsert(docData);
        }
      }

      console.log('Datos importados exitosamente.');
    } catch (error) {
      console.error('Error importando datos:', error);
    }
  }
}
