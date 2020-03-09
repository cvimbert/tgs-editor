import { JsonObject, JsonProperty } from 'json2typescript';
import { SequenceThreadStep } from './sequence-thread-step.class';

@JsonObject("SequenceThread")
export class SequenceThread {

  @JsonProperty("steps", [SequenceThreadStep], true)
  steps: SequenceThreadStep[] = [];
}