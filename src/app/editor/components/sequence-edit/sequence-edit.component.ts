import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilesManagerService } from '../../services/files-manager.service';
import { Compiler } from 'tgs-compiler/index';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { MainStructure, TgsMainStructure } from 'tgs-model';
import { SequenceService } from '../../services/sequence.service';
import { TgsGameBlock } from 'tgs-model/model/new-model/tgs-game-block.class';
import { Subject } from 'rxjs';

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

  private currentBlock: TgsGameBlock;
  cursorPosition: Subject<number> = new Subject();


  @ViewChild("editor") editor: CodemirrorComponent;


  constructor(
    private filesManager: FilesManagerService,
    public sequenceService: SequenceService
  ) { }

  ngOnInit() {
    this.loadFile(this.path);

    this.cursorPosition.subscribe(pos => {      

      this.selectBlockByCursorPos(pos);

      /* if (this.tgsService.rawContent !== "") {
        this.refreshInspector();
        this.selectBlockByCursorPos(pos);
      } */
      
    });
  }

  loadFile(path: string) {
    this.content = "";
    this.filesManager.loadFile(path).then(content => {
      this.content = content;

      setTimeout(() => this.editor.codeMirror.getDoc().clearHistory());

      this.selectBlockByCursorPos(0);

      this.compileContent();
    });
  }

  compileContent() {
    let res = this.compiler.parseTGSString(this.content, TgsMainStructure);
    res.fillObject();
    this.sequenceModel = <TgsMainStructure>res;
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

    console.log(index);
    

    for (let block of this.sequenceModel.blocks) {

      let endIndex = blockNum < this.sequenceModel.blocks.length - 1 ? this.sequenceModel.blocks[blockNum + 1].startIndex : this.content.length;

      if (index >= block.startIndex && index < endIndex) {

        if (block !== this.currentBlock) {
          console.log(block);
          
          this.highlightSelectedBlockLines(block);
        }
        
        this.currentBlock = block;

        // this.ref.detectChanges();
        return;
      }

      blockNum++;
    }
  }

  convertLineAndChToPosition(line: number, ch: number): number {

    let count: number = 0;

    for (let i: number = 0; i < line; i++) {
      count += this.editor.codeMirror.getDoc().getLine(i).length + 1;
    }

    return count + ch;
  }

  onCursorActivity(evt: any) {
    let pos: any = evt.getDoc().getCursor();
    let charPos = this.convertLineAndChToPosition(pos.line, pos.ch);
    this.selectBlockByCursorPos(charPos);

    this.cursorPosition.next(charPos);

    /* if (!this.initialized) {
      this.editor.codeMirror.refresh();
      this.initialized = true;
    } */
    
  }

  highlightSelectedBlockLines(block: TgsGameBlock): number[] {
    let lines: number[] = [];

    let startLine = this.getPosition(block.startIndex)["line"];

    let blockIndex = this.sequenceModel.blocks.indexOf(block);

    let endLine = (blockIndex >=  this.sequenceModel.blocks.length - 1) ? this.getPosition(block.endIndex)["line"] : (this.getPosition(this.sequenceModel.blocks[blockIndex + 1].startIndex))["line"] - 1;

    let doc = this.editor.codeMirror.getDoc();

    for (let i: number = 0; i < doc.lineCount(); i++) {
      (doc as any).removeLineClass(i, "background", "selected");
    }

    for (let i: number = startLine; i <= endLine; i++) {
      lines.push(i);
      (doc as any).addLineClass(i, "background", "selected");
    }

    return lines;
  }

  getPosition(index: number): Object {
    let count = 0;
    let lineNum = 0;

    let res: Object = {};

    if (!this.editor.codeMirror) return;

    this.editor.codeMirror.getDoc().eachLine(line => {
      let newCount = count + line.text.length + 1;

      if (index >= count && index < newCount) {
        res = {
          line: lineNum,
          char: index - count
        }
      }
      
      count = newCount;
      lineNum++;
    });
  }

}
