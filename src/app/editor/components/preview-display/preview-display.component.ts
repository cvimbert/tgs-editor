import { Component, OnInit } from '@angular/core';
import { SequenceService } from '../../services/sequence.service';
import { TgsMainStructure } from 'tgs-model';

@Component({
  selector: 'preview-display',
  templateUrl: './preview-display.component.html',
  styleUrls: ['./preview-display.component.scss']
})
export class PreviewDisplayComponent implements OnInit {

  constructor(
    public sequenceService: SequenceService
  ) { }

  ngOnInit() {
  }

  get currentSequence(): TgsMainStructure {
    return this.sequenceService.currentSequence;
  }

}
