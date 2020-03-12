import { JsonObject, JsonProperty } from 'json2typescript';
import { SequenceThreadStep } from './sequence-thread-step.class';

@JsonObject("SequenceThread")
export class SequenceThread {

  @JsonProperty("steps", [SequenceThreadStep], true)
  steps: SequenceThreadStep[] = [];

  push(id: string) {
    let newStep = new SequenceThreadStep();
    newStep.blockId = id;
    this.steps.push(newStep);
  }

  reset() {
    this.steps = [];
  }

  goBack() {
    this.steps.pop();
  }
}