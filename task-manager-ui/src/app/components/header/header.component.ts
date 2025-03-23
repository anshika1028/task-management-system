import { NgIcon } from "@ng-icons/core";
import {
  HeaderModule,
  PanelModule,
  ThemeModule,
} from "carbon-components-angular";

import { Component, inject } from "@angular/core";
import { UserStore } from "../../stores/user.store";
@Component({
  selector: "app-header",
  imports: [HeaderModule, ThemeModule, PanelModule, NgIcon],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private userStore = inject(UserStore);

  username = this.userStore?.user?.username ?? "";

  isAdmin = this.userStore.isAdmin;

  logout() {
    this.userStore.logout();
  }
}
