import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';
import { Compiler } from 'tgs-compiler/index';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { MainStructure, TgsMainStructure } from 'tgs-model';
import { SequenceService } from '../../services/sequence.service';
import { TgsGameBlock } from 'tgs-model/model/new-model/tgs-game-block.class';

@Component({
  selector: 'sequence-edit',
  templateUrl: './sequence-edit.component.html',
  styleUrls: ['./sequence-edit.component.scss']
})
export class SequenceEditComponent implements OnInit {

  content = "";
  sequenceModel: TgsMainStructure;
  private path = "projects/p1/index.tgs";
  private compiler = new Compiler();

  private currentBlock: TgsGameBlock

  @ViewChild("editor") editor: CodemirrorComponent;


  constructor(
    private filesManager: FilesManagerService,
    public sequenceService: SequenceService
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
    // console.log(res);
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

  selectBlockByCursorPos(index: number) {

    if (!this.sequenceModel) return;

    let blockNum = 0;

    for (let block of this.sequenceModel.blocks) {

      let endIndex = blockNum < this.sequenceModel.blocks.length - 1 ? this.sequenceModel.blocks[blockNum + 1].startIndex : this.content.length;

      if (index >= block.startIndex && index < endIndex) {

        if (block !== this.currentBlock) {
          // TODO
          // this.highlightSelectedBlockLines(block);
        }
        
        this.currentBlock = block;

        // this.ref.detectChanges();
        return;
      }

      blockNum++;
    }
  }
}
