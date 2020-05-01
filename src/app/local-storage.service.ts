import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// key that is used to access the data in local storage
const STORAGE_KEY = 'taskId_';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }
  public save(taskId: string, formData: any): void {
    //console.log('!!!saving locals');
    this.storage.set(STORAGE_KEY + taskId, formData);
  }
  public get(taskId: string): any {
    //console.log('!!!getting locals:', this.storage.get(STORAGE_KEY + taskId));
    return this.storage.get(STORAGE_KEY + taskId);
  }
  public has(taskId: string): boolean {
    //console.log('!!!has locals:', this.storage.has(STORAGE_KEY + taskId));
    return this.storage.has(STORAGE_KEY + taskId);
  }
  public remove(taskId: string): void {
    //console.log('!!!removing locals');
    this.storage.remove(STORAGE_KEY + taskId);
  }
}
