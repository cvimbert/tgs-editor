import { Component, OnInit, Input } from '@angular/core';
import { TgsGameBlockLine } from 'tgs-model/model/new-model/tgs-game-block-line.class';

@Component({
  selector: 'preview-line-display',
  templateUrl: './preview-line-display.component.html',
  styleUrls: ['./preview-line-display.component.scss']
})
export class PreviewLineDisplayComponent implements OnInit {

  @Input() line: TgsGameBlockLine;

  constructor() { }

  ngOnInit() {
    // console.log(this.line);
    
  }

}
