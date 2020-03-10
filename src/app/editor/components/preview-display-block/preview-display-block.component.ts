import { Component, OnInit, Input } from '@angular/core';
import { SequenceThreadStep } from 'src/app/sequence-thread/sequence-thread-step.class';
import { TgsGameBlock } from 'tgs-model/model/new-model/tgs-game-block.class';
import { SequenceService } from '../../services/sequence.service';

@Component({
  selector: 'preview-display-block',
  templateUrl: './preview-display-block.component.html',
  styleUrls: ['./preview-display-block.component.scss']
})
export class PreviewDisplayBlockComponent implements OnInit {

  @Input() threadStep: SequenceThreadStep;
  block: TgsGameBlock;

  constructor(
    public sequenceService: SequenceService
  ) { }

  ngOnInit() {
    if (this.threadStep) {
      this.block = this.sequenceService.currentSequence.getBlock(this.threadStep.blockId);
    } else {
      this.block = this.sequenceService.currentSequence.firstBlock;
    }

    console.log(this.block);
    
  }

}
