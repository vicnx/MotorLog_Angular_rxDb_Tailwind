// utils.ts


// @ts-ignore
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // Funciones y utilidades de la aplicación

  // Función que genera un avatar
  public  generateAvatar(name: string, options?: any): any {
    const avatar = createAvatar(personas, {
      seed: name,
      ...options, // Puedes proporcionar otras opciones personalizadas si es necesario
    });

    return avatar.toDataUriSync();
  }

  public  generateUsername(name: string): any {
    return name.toLowerCase().split(" ").map(word => word[0]).join("");
  }
}
