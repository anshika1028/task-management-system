import { Injectable } from '@angular/core';
import axios from 'axios';
import { MetaStore } from '../stores/meta.store';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private apiUrl = `${environment.apiBaseUrl}/api/meta`; // ✅ Change this if needed

  constructor(private metaStore: MetaStore) {}

  /**
   * Fetch meta data (roles, priorities, public holidays)
   */
  async fetchMetaData(): Promise<void> {
    try {
      const response = await axios.get(this.apiUrl);
      if (response.data.success) {
        // ✅ Update MobX Store
        this.metaStore.setMetaData(response.data.data);
      }
    } catch (error: any) {
      console.error("❌ Error fetching meta data:", error.response?.data || error.message);
      throw error;
    }
  }
}
