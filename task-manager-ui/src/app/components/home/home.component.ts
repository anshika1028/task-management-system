import {
  LinkModule,
  PaginationModule,
  ThemeModule,
} from "carbon-components-angular";

import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  imports: [ThemeModule, PaginationModule, LinkModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})

/**
 * Component representing the home page, displaying search functionality and package results.
 */
export class HomeComponent {}
