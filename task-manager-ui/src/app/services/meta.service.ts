import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { environment } from "../../environment";
import { MetaStore } from "../stores/meta.store";

@Injectable({
  providedIn: "root",
})
export class MetaService {
  private apiUrl = `${environment.apiBaseUrl}/api/meta`;

  constructor(
    private http: HttpClient,
    private metaStore: MetaStore,
  ) {}

  /**
   * Fetch meta data (roles, priorities, public holidays)
   */
  fetchMetaData(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.metaStore.setMetaData(response.data);
        }
      },
      error: (error) => {
        console.error(
          "❌ Error fetching meta data:",
          error.error || error.message,
        );
        return throwError(() => error);
      },
    });
  }
}
