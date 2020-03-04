import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';
import { Compiler } from 'tgs-compiler/index';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { MainStructure, TgsMainStructure } from 'tgs-model';

@Component({
  selector: 'sequence-edit',
  templateUrl: './sequence-edit.component.html',
  styleUrls: ['./sequence-edit.component.scss']
})
export class SequenceEditComponent implements OnInit {

  content = "";
  sequenceModel: MainStructure;
  private path = "projects/p1/index.tgs";
  private compiler = new Compiler();

  @ViewChild("editor") editor: CodemirrorComponent;


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

      setTimeout(() => this.editor.codeMirror.getDoc().clearHistory());

      this.compileContent();
    });
  }

  compileContent() {
    let res = this.compiler.parseTGSString(this.content, TgsMainStructure);
    res.fillObject();
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
