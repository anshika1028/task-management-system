import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { MarkdownModule, provideMarkdown } from "ngx-markdown";

import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { ErrorHandler } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideIcons } from "@ng-icons/core";
import { heroUserSolid } from "@ng-icons/heroicons/solid";
import { routes } from "./app.routes";
import { HttpErrorInterceptor } from "./services/http-error-interceptor";
import { ErrorInterceptor } from "./services/error.interceptor";
import { GlobalErrorHandler } from "./services/globa-error-handler";
import { JwtInterceptor } from "./services/jwt.interceptor";
import { LoggingService } from "./services/logging-service";

MarkdownModule.forRoot();
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    LoggingService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideMarkdown(),
    provideIcons({ heroUserSolid }),
  ],
};
