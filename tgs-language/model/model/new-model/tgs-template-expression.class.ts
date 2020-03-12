import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject } from 'json2typescript';
import { TgsBlockId } from './tgs-block-id.class';

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
        id: "content",
        reference: "content"
      },
      {
        id: "closure",
        expression: /\}/
      }
    ],
    sub: {
      content: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "blockId",
            reference: TgsBlockId
          }
        ]
      }
    }
  };

  fillObject() {
    console.log(this);
    super.fillObject();
  }
}