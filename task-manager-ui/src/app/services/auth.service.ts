import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environment";
import { UserStore } from "../stores/user.store";
import { catchError, map } from "rxjs/operators";
import { firstValueFrom, throwError } from "rxjs";

interface User {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = "/api/auth";

  constructor(
    private http: HttpClient,
    private userStore: UserStore,
  ) {}

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * ✅ Login Function
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const response$ = this.http
        .post<any>(`${this.baseUrl}${this.apiUrl}/login`, {
          username,
          password,
        })
        .pipe(
          map((response) => {
            if (response.success) {
              localStorage.setItem("token", response.data.token);
              this.userStore.setUser(response.data.user);
              return response.data;
            } else {
              throw new Error(response.message || "Login failed");
            }
          }),
          catchError((error) => {
            console.error("❌ Login Error:", error);
            return throwError(() => error.error || "Login failed");
          }),
        );

      return await firstValueFrom(response$);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * ✅ Register Function
   */
  async register(
    username: string,
    password: string,
    role: string,
  ): Promise<any> {
    try {
      const response$ = this.http
        .post<any>(`${this.baseUrl}${this.apiUrl}/register`, {
          username,
          password,
          role,
        })
        .pipe(
          map((response) => {
            if (response.success) {
              return response.data;
            } else {
              throw new Error(response.message || "Registration failed");
            }
          }),
          catchError((error) => {
            console.error("❌ Registration Error:", error);
            return throwError(() => error.error || "Registration failed");
          }),
        );

      return await firstValueFrom(response$);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
