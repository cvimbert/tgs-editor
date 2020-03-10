import { Component, OnInit, Input } from '@angular/core';
import { SequenceThreadStep } from 'src/app/sequence-thread/sequence-thread-step.class';
import { TgsGameBlock } from 'tgs-model/model/new-model/tgs-game-block.class';
import { SequenceService } from '../../services/sequence.service';
import { TgsLinkItem } from 'tgs-model/model/new-model/tgs-link-item.class';

@Component({
  selector: 'preview-display-block',
  templateUrl: './preview-display-block.component.html',
  styleUrls: ['./preview-display-block.component.scss']
})
export class PreviewDisplayBlockComponent implements OnInit {

  @Input() threadStep: SequenceThreadStep;
  @Input() index: number;
  block: TgsGameBlock;

  constructor(
    public sequenceService: SequenceService
  ) { }

  ngOnInit() {    
    this.block = this.sequenceService.currentSequence.getBlock(this.threadStep.blockId);
  }

  selectLink(link: TgsLinkItem) {
    this.sequenceService.currentThread.steps.push({
      blockId: link.localLinkRef
    });
  }
}
