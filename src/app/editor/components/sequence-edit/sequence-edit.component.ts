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
  navigationActivated = false;

  selectedLink: HTMLElement;
  listenLink = false;

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
    });

    setTimeout(() => {
      this.editor.codeMirror.on("change", () => {
        this.compileContent();
      });
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
  }

  saveFile(path: string) {
    this.filesManager.saveToExistingFile(path, this.content).then(() => console.log("File saved."));
  }

  @HostListener("document:keydown", ["$event"])
  onKeyPressed(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = true;
      this.checkLink();
    }

    if (evt.ctrlKey) {
      switch (evt.key) {
        case "s":
          this.saveFile(this.path);
          break;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onkeyUp(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = false;
      this.uncheckLink();
    }
  }

  @HostListener('click', ['$event'])
  testLinkClick(evt: MouseEvent) {
    if (this.selectedLink && this.navigationActivated) {
      this.linkClick(evt);
    }
  }

  @HostListener('mouseover', ['$event'])
  rollOverLink(evt: MouseEvent) {
    if (!this.navigationActivated) {
      return;
    }

    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref") || element.classList.contains("cm-linkref-local")) {
      this.selectedLink = element;
      this.checkLink();
    }
  }

  @HostListener('mouseout', ['$event'])
  rollOutLink(evt: MouseEvent) {
    if (!this.navigationActivated) {
      return;
    }

    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref") || element.classList.contains("cm-linkref-local")) {
      this.uncheckLink();
      this.selectedLink = null;
    }
  }

  checkLink() {    
    if (this.selectedLink && this.navigationActivated && !this.listenLink) {
      this.selectedLink.classList.add("cm-underline");
      this.listenLink = true;
    }
  }

  uncheckLink() {
    if (this.listenLink) {
      this.listenLink = false;
      this.selectedLink.classList.remove("cm-underline");
    }
  }

  linkClick(evt: MouseEvent) {
    let element: HTMLElement = evt.target as HTMLElement;

    let linkExp = /([A-Za-z0-9-\/]+)?(?:#([A-Za-z0-9-]+))?/;

    let res = linkExp.exec(element.innerHTML);

    let path = res[1];
    let blockId = res[2];

    // trois cas
    if (blockId && !path) {
      // lien local, on checke si le bloc existe

      if (this.sequenceModel.getBlock(blockId)) {
        // on y positionne le curseur
        this.selectBlock(this.sequenceModel.getBlock(blockId));
      } else {
        // on crée un nouveau block (pour l'instant à la fin)
        this.content += "\n\n#" + blockId + "\n\n\tTxt...\n";

        // et on positionne le curseur à la fin de ce block
        this.compileContent();

        setTimeout(() => {
          this.selectBlock(this.sequenceModel.getBlock(blockId));
        });
      }

    } /* else if (!blockId && path) {
      // lien externe sans blockId
      this.router.navigate(["editor"], {
        queryParams: {
          path: path
        }
      });

      this.save();

    } else if (blockId && path) {
      // lien externe et blockId
      this.router.navigate(["editor"], {
        queryParams: {
          path: path,
          block: blockId
        }
      });

      this.save();
    } */
  }

  /* refreshInspector() {
    if (this.content && this.content !== "") {
      let parser: TGSParser = new TGSParser();
      let result: ParsingResult = parser.parseTGSString(this.content);
      this.mainModel = MainStructure.loadFromParsingResult(result);
    }
  } */

  selectBlock(model: TgsGameBlock) {
    this.editor.codeMirror.focus();

    this.highlightSelectedBlockLines(model);
    
    this.currentBlock = model;
   
    this.setCursorPos(model.startIndex);
    this.setBlockScroll(model);
  }

  setBlockScroll(block: TgsGameBlock) {
    let startLine: number = this.getPosition(block.startIndex)["line"];
    let endLine: number = this.getPosition(block.endIndex)["line"] + 1;

    this.editor.codeMirror.scrollIntoView({
      from: {
        line: startLine,
        ch: 0
      },
      to: {
        line: endLine,
        ch: 0
      },
    }, 100);
  }

  setCursorPos(index: number) {
    let count = 0;
    let lineNum = 0;

    if (!this.editor.codeMirror) return;

    this.editor.codeMirror.getDoc().eachLine(line => {
      let newCount = count + line.text.length + 1;

      if (index >= count && index < newCount) {
        this.editor.codeMirror.getDoc().setCursor(lineNum, index - count, {
          scroll: true
        });
      }
      
      count = newCount;
      lineNum++;
    });
  }

  selectBlockByCursorPos(index: number) {

    if (!this.sequenceModel) return;

    let blockNum = 0;    

    for (let block of this.sequenceModel.blocks) {

      let endIndex = blockNum < this.sequenceModel.blocks.length - 1 ? this.sequenceModel.blocks[blockNum + 1].startIndex : this.content.length;

      if (index >= block.startIndex && index < endIndex) {

        if (block !== this.currentBlock) {          
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

  onContentUpdate() {
    console.log("update");
    
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

    return res;
  }

}
