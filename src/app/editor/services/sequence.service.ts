import { Injectable } from '@angular/core';
import { TgsMainStructure } from 'tgs-model';
import { SequenceThread } from 'src/app/sequence-thread/sequence-thread.class';
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { FilesManagerService } from './files-manager.service';
import { TgsManager } from 'tgs-model/model/new-model/tgs-manager.class';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  currentThread: SequenceThread;
  currentSequence: TgsMainStructure;
  threadPath: string;

  manager: TgsManager;

  private serializer = new JsonConvert(
    OperationMode.ENABLE,
    ValueCheckingMode.ALLOW_NULL,
    true
  );

  constructor(
    public filesManager: FilesManagerService,
    electronService: ElectronService
  ) {
    this.manager = new TgsManager(electronService.remote.require("fs"));
  }

  loadThread(path: string) {
    this.currentThread = null;
    this.threadPath = path;

    this.filesManager.loadFile(path).then(content => {
      let obj = JSON.parse(content);
      this.currentThread = this.serializer.deserializeObject(obj, SequenceThread);
    }).catch(() => {
      this.currentThread = new SequenceThread();
    });
  }

  saveThread() {
    if (this.currentThread) {
      let obj = this.serializer.serializeObject(this.currentThread);
      this.filesManager.saveToFile(this.threadPath, JSON.stringify(obj));
    } else {
      console.log("No thread to save.");
    }
  }

  exportSequence(path: string) {
    let json = this.serializer.serializeObject(this.currentSequence);

    // en attendant une conf
    this.filesManager.saveToFile(`C:/unity/Spaceship/Assets/Resources/Definitions/${ path }.json`, JSON.stringify(json));
    console.log("exported");
  }
}
