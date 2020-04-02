import { Component, OnInit, Input } from '@angular/core';
import { TgsComplexTextBlock } from 'tgs-model/model/new-model/tgs-complex-text-block.class';

@Component({
  selector: 'preview-display-complex-block',
  templateUrl: './preview-display-complex-block.component.html',
  styleUrls: ['./preview-display-complex-block.component.scss']
})
export class PreviewDisplayComplexBlockComponent implements OnInit {

  @Input() complexBlock: TgsComplexTextBlock;

  classArray: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit() {
    if (this.complexBlock.styles) {
        this.complexBlock.styles.basicStyles.forEach(style => {
          this.classArray["block-style-" + style] = true;
      });
    }
  }

}
