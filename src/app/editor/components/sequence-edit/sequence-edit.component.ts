import { Component, OnInit, HostListener } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';
import { Compiler } from 'src/app/compiler/compiler.class';
import { TgsConfiguration } from 'src/app/tgs-language/tgs-configuration.class';

@Component({
  selector: 'sequence-edit',
  templateUrl: './sequence-edit.component.html',
  styleUrls: ['./sequence-edit.component.scss']
})
export class SequenceEditComponent implements OnInit {

  content = "";
  private path = "projects/p1/index.tgs";
  private compiler = new Compiler(TgsConfiguration.mainConfiguration);

  constructor(
    private filesManager: FilesManagerService
  ) { }

  ngOnInit() {
    this.loadFile(this.path);
  }

  loadFile(path: string) {
    this.content = "";
    this.filesManager.loadFile(path).then(content => {
      this.content = content;
      this.compileContent();
    });
  }

  compileContent() {
    let res = this.compiler.parseTGSString(this.content);
    console.log(res);
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
