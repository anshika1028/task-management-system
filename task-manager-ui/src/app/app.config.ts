import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideIcons } from "@ng-icons/core";
import {
  heroArrowUturnLeftSolid,
  heroChartBarSolid,
  heroChevronDownSolid,
  heroChevronUpSolid,
  heroClockSolid,
  heroFunnelSolid,
  heroPencilSolid,
  heroPlusSolid,
  heroTrashSolid,
  heroUserSolid,
  heroXMarkSolid,
} from "@ng-icons/heroicons/solid";
import { MarkdownModule, provideMarkdown } from "ngx-markdown";
import { routes } from "./app.routes";
import { GlobalErrorHandler } from "./services/global-error-handler";

import {
  httpAuthInterceptor,
  httpErrorInterceptor,
} from "./services/http-interceptors";
import { LoggingService } from "./services/logging-service";

MarkdownModule.forRoot();
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    LoggingService,
    provideHttpClient(
      withInterceptors([httpErrorInterceptor, httpAuthInterceptor]),
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideMarkdown(),
    provideIcons({
      heroUserSolid,
      heroPlusSolid,
      heroChartBarSolid,
      heroClockSolid,
      heroPencilSolid,
      heroTrashSolid,
      heroFunnelSolid,
      heroXMarkSolid,
      heroChevronDownSolid,
      heroChevronUpSolid,
      heroArrowUturnLeftSolid,
    }),
  ],
};
