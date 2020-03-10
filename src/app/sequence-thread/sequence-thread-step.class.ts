import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("SequenceThreadStep")
export class SequenceThreadStep {

  @JsonProperty("blockId", String, true)
  blockId = "";
}