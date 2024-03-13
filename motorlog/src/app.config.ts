import { HttpClientModule, HttpBackend, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { initDatabase } from '@shared/services/db.service';
import { HttpLoaderFactory } from './main';
import { routes } from './routes';
import { ErrorResponseInterceptor } from '@shared/interceptors/error-response.interceptor';
import { LoadingInterceptor } from '@shared/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch(), withInterceptors([ErrorResponseInterceptor, LoadingInterceptor])),
        importProvidersFrom(
            BrowserModule,
            HttpClientModule,
            TranslateModule.forRoot({
                defaultLanguage: 'es',
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpBackend]
                }
            }),
            BrowserAnimationsModule
        ),
        provideRouter(routes),
        { provide: APP_INITIALIZER, useFactory: () => initDatabase, multi: true }
    ]
};
