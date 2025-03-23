import { Injectable } from "@angular/core";
import { observable, action, computed, makeObservable } from "mobx";
import { Router } from "@angular/router";

interface User {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: "root",
})
export class UserStore {
  @observable user: User | null = null;

  constructor(private router: Router) {
    makeObservable(this);
    this.loadUserFromStorage();
  }

  /**
   * ✅ Load user from localStorage (persist session)
   */
  private loadUserFromStorage() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  /**
   * ✅ Set user data after login
   */
  @action setUser(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * ✅ Clear user data on logout
   */
  @action logout() {
    this.user = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  /**
   * ✅ Check if user is authenticated
   */
  @computed get isAuthenticated(): boolean {
    return this.user !== null;
  }

  /**
   * ✅ Check if user is an Admin
   */
  @computed get isAdmin(): boolean {
    return this.user?.role === "admin";
  }

  /**
   * ✅ Get current user role
   */
  @computed get userRole(): string | null {
    return this.user?.role || null;
  }

  /**
   * ✅ Get username
   */
  @computed get username(): string | null {
    return this.user?.username || null;
  }
}
