import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsBoolean")
export class TgsBoolean extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "value",
        expression: /(true|false)/,
        groups: ["value"]
      }
    ]
  };

  @JsonProperty("value", Boolean, true)
  value = false;

  constructObject() {
    this.value = this.getFirstValue("value@value") === "true";
  }
}