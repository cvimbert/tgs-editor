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
        expression: /-{4,}/
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
            id: "blocklineB",
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

  isBreak = false;

  @JsonProperty("directText", String, true)
  directText = "";

  @JsonProperty("template", TgsTemplateExpression, true)
  template: TgsTemplateExpression = null;

  constructObject() {
    this.directText = this.getFirstValue("blockline/blocklineB@text");
    this.template = <TgsTemplateExpression>this.getFirstResult("blockline/template");

    this.isBreak = this.getFirstKey() === "doubleBreak";
  }

  get texts(): string[] {
    if (this.directText != undefined) {
      return [this.directText];
    } else if (this.template) {
      return this.template.texts;
    }
  }
}