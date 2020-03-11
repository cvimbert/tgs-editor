import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { SequenceService } from '../../services/sequence.service';
import { TgsMainStructure } from 'tgs-model';
import { SequenceThreadStep } from 'src/app/sequence-thread/sequence-thread-step.class';
import { PreviewDisplayBlockComponent } from '../preview-display-block/preview-display-block.component';

@Component({
  selector: 'preview-display',
  templateUrl: './preview-display.component.html',
  styleUrls: ['./preview-display.component.scss']
})
export class PreviewDisplayComponent implements OnInit {

  @ViewChildren("block") blocks: QueryList<PreviewDisplayBlockComponent>;

  constructor(
    public sequenceService: SequenceService
  ) { }

  ngOnInit() {
    
  }

  update() {
    this.blocks.forEach(block => block.update());
  }

  get currentSequence(): TgsMainStructure {
    return this.sequenceService.currentSequence;
  }

  get steps(): SequenceThreadStep[] {    
    if (this.sequenceService.currentThread.steps.length === 0) {      
      this.sequenceService.currentThread.push(this.sequenceService.currentSequence.firstBlock.id);      
    }
    
    return this.sequenceService.currentThread.steps;
  }

}
