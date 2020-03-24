import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsString")
export class TgsString extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /"/
      },
      {
        id: "content",
        expression: /(.*?)(?=")/,
        groups: ["value"]
      },
      {
        id: "closer",
        expression: /"/
      }
    ]
  };

  @JsonProperty("value", String, true)
  value = "";

  constructObject() {
    this.value = this.getFirstValue("content@value")
    // console.log(this);
  }
}