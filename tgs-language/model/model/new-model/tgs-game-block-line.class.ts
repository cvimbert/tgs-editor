import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsGameBlockLine")
export class TgsGameBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "doubleBreak",
        expression: /[\r|\n|\n\r](?:[^\n]\s*?)[\r|\n|\n\r]/
      },
      {
        id: "blockline",
        reference: "blockLine2"
      }
    ],
    sub: {
      blockLine2: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "blockline",
            expression: /(?!#|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>])/,
            groups: ["text"]
          }
        ]
      }
    }
  };

  @JsonProperty("text", String, true)
  text = "";

  fillObject() {
    super.fillObject();
    this.text = this.getFirstValue("blockline/blockline@text");    
  }
}