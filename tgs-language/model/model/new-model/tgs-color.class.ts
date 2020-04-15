import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsColor")
export class TgsColor extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "hexalVal",
        expression: /0x/
      },
      {
        id: "red",
        reference: "val"
      },
      {
        id: "green",
        reference: "val"
      },
      {
        id: "blue",
        reference: "val"
      }
    ],
    sub: {
      val: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "val",
            expression: /([0-9a-f]{2})/,
            groups: ["value"]
          }
        ]
      }
    }
  };

  @JsonProperty("r", Number, true)
  red = 0;

  @JsonProperty("g", Number, true)
  green = 0;

  @JsonProperty("b", Number, true)
  blue = 0;

  private getNumFromHex(val: string): number {
    return parseInt(val, 16);
  }

  constructObject() {
    this.red = this.getNumFromHex(this.getFirstValue("red/val@value"));
    this.green = this.getNumFromHex(this.getFirstValue("green/val@value"));
    this.blue = this.getNumFromHex(this.getFirstValue("blue/val@value"));    
  }
}