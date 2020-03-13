import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsBlockId } from './tgs-block-id.class';
import { TgsMainStructure } from './tgs-main-structure.class';

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

  @JsonProperty("referencedBlockId")
  referencedBlockId = "";

  constructObject() {
    this.referencedBlockId = (<TgsBlockId>this.getFirstResult("content/blockId")).id;
    // console.log(this.getFirstResult("content/blockId"));
  }

  get texts(): string[] {
    if (this.referencedBlockId) {

      let block = (<TgsMainStructure>this.root).blocks.find(block => block.id === this.referencedBlockId);

      if (block) {
        return block.linesText;
      }
    }

    return [];
  }

}