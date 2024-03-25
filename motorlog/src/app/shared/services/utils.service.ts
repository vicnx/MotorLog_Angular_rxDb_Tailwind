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
    public generateAvatar(name: string, options?: any): any {
        const avatar = createAvatar(personas, {
            seed: name,
            ...options // Puedes proporcionar otras opciones personalizadas si es necesario
        });

        return avatar.toDataUriSync();
    }

    public generateUsername(name: string): any {
        const words = name.toLowerCase().split(' ');
        //prettier-ignore
        return words.length == 1 ? words[0] : words[0][0] + (words.length > 1 ? words[1] : '') + (words.length > 2 ? words.slice(2).map(word => word[0]).join("") : '');
    }
}
