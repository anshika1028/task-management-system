import { Injectable } from '@angular/core';
import { observable, action, makeObservable } from 'mobx';

@Injectable({
  providedIn: 'root'
})
export class MetaStore {
  @observable roles: string[] = [];
  @observable priorities: string[] = [];
  @observable publicHolidays: { id: number; holiday_name: string; date: string }[] = [];

  constructor() {
    makeObservable(this);
  }

  /**
   * ✅ Update Store with Meta Data
   */
  @action setMetaData(data: { roles: string[]; priorities: string[]; publicHolidays: any[] }) {
    this.roles = data.roles;
    this.priorities = data.priorities;
    this.publicHolidays = data.publicHolidays;
  }
}
