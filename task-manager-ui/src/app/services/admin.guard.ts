import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { UserStore } from "../stores/user.store";

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private userStore: UserStore,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const role = this.userStore.userRole;
    if (role === "admin") {
      return true;
    }

    // not authorized so redirect to home page
    this.router.navigate(["/"]);
    return false;
  }
}
