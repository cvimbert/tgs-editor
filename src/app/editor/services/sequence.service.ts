import { Injectable } from '@angular/core';
import { TgsMainStructure } from 'tgs-model';
import { SequenceThread } from 'src/app/sequence-thread/sequence-thread.class';
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { ElectronService } from 'ngx-electron';
import { FilesManagerService } from './files-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  currentThread: SequenceThread;
  currentSequence: TgsMainStructure;

  private serializer = new JsonConvert(
    OperationMode.ENABLE,
    ValueCheckingMode.ALLOW_NULL,
    true
  );

  constructor(
    private filesManager: FilesManagerService
  ) {}

  loadThread(path: string) {
    this.currentThread = null;
  }
}
