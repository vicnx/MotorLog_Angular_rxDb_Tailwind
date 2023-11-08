import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './routes';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(httpHandler: HttpBackend) {
    return new TranslateHttpLoader(new HttpClient(httpHandler), './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
    providers: [
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
            })
        ),
        provideRouter(routes)
    ]
}).catch((err) => console.error(err));
