import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject } from 'json2typescript';

@JsonObject("TgsTemplateExpression")
export class TgsTemplateExpression extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opening",
        expression: /\{/
      },
      {
        id: "closure",
        expression: /\}/
      }
    ]
  };

  fillObject() {

  }
}