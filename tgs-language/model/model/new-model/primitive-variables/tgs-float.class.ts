import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsFloat")
export class TgsFloat extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "value",
        expression: /([0-9]+(?:\.[0-9]+)?)/,
        groups: ["value"]
      }
    ]
  };

  @JsonProperty("value", Number, true)
  value = 0;

  constructObject() {
    this.value = +this.getFirstValue("value@value");    
  }
}