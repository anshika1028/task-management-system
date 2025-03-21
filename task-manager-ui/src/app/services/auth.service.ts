import { Injectable } from "@angular/core";
import axios from "axios";
import { environment } from "../../environment";
import { UserStore } from "../stores/user.store";

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
  private apiUrl = "/api/auth"; // Adjust as needed

  constructor(private userStore: UserStore) {} // ✅ Injecting MobX Store

  /**
   * ✅ Login Function
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}${this.apiUrl}/login`, {
        username,
        password,
      });
      // ✅ Store user in MobX Store & LocalStorage
      localStorage.setItem("token", response.data.data.token);
      this.userStore.setUser(response.data.data.user);

      return response.data.data;
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      return Promise.reject(error.response?.data || "Login failed");
    }
  }

  /**
   * ✅ Register Function
   */
  async register(username: string, password: string, role: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}${this.apiUrl}/register`, {
        username,
        password,
        role,
      });

      return response.data.data;
    } catch (error: any) {
      console.error("❌ Registration Error:", error);
      return Promise.reject(error.response?.data || "Registration failed");
    }
  }
}
