import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';
import { Compiler } from 'tgs-compiler/index';
import { TgsConfiguration } from 'tgs-language/tgs-configuration.class';
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
  private compiler = new Compiler(TgsConfiguration.mainConfiguration);

  @ViewChild("editor") editor: CodemirrorComponent;


  constructor(
    private filesManager: FilesManagerService
  ) { }

  ngOnInit() {
    this.loadFile(this.path);
    console.log(TgsMainStructure["assertions"]);
    
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
    let res = this.compiler.parseTGSString(this.content);
    this.sequenceModel = MainStructure.loadFromCompilerResult(res);
    console.log(this.sequenceModel);
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
