import { HttpBackend, HttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { appConfig } from './app.config';
import { AppComponent } from './app/app.component';

export function HttpLoaderFactory(httpHandler: HttpBackend) {
    return new TranslateHttpLoader(new HttpClient(httpHandler), './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
