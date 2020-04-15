import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class FilesManagerService {

  private fs: any;

  constructor(
    electronService: ElectronService
  ) {
    this.fs = electronService.remote.require("fs");
  }

  // TODO
  normalizeLineBreaks() {

  }

  loadFile(path: string): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (err: Error) => void) => {      
      this.fs.readFile(path, "utf8", (err: Error, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  saveToFile(path: string, content: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (err: Error) => void) => {
      this.fs.writeFile(path, content, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
