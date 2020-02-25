import { Component, OnInit, HostListener } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';

@Component({
  selector: 'sequence-edit',
  templateUrl: './sequence-edit.component.html',
  styleUrls: ['./sequence-edit.component.scss']
})
export class SequenceEditComponent implements OnInit {

  private content = "";
  private path = "projects/p1/index.tgs";

  constructor(
    private filesManager: FilesManagerService
  ) { }

  ngOnInit() {
    this.loadFile(this.path);
  }

  loadFile(path: string) {
    this.content = "";
    this.filesManager.loadFile(path).then(txt => this.content = txt);
  }

  saveFile(path: string) {
    this.filesManager.saveToExistingFile(path, this.content).then(() => console.log("File saved."));
  }

  @HostListener("document:keydown", ["$event"])
  onKeyPressed(evt: KeyboardEvent) {
    if (evt.ctrlKey) {
      switch (evt.key) {
        case "s":
          this.saveFile(this.path);
          break;
      }
    }
  }

}
