import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsTemplateExpression } from './tgs-template-expression.class';

@JsonObject("TgsGameBlockLine")
export class TgsGameBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "doubleBreak",
        expression: /\n\n/
      },
      {
        id: "blockline",
        reference: "blockLine2"
      }
    ],
    sub: {
      blockLine2: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "blockline",
            expression: /(?!#|\s*\{|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>\{])/,
            groups: ["text"]
          },
          {
            id: "template",
            reference: TgsTemplateExpression
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