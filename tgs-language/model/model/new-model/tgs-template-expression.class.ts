import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsBlockId } from './tgs-block-id.class';
import { TgsMainStructure } from './tgs-main-structure.class';
import { TgsGameBlock } from './tgs-game-block.class';

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

  // referencedBlock: TgsGameBlock;

  constructObject() {
    this.referencedBlockId = (<TgsBlockId>this.getFirstResult("content/blockId")).id;
  }

  get referencedBlock(): TgsGameBlock {
    return (<TgsMainStructure>this.root).getBlock(this.referencedBlockId);
  }

  get texts(): string[] {
    if (this.referencedBlockId) {
      let block = (<TgsMainStructure>this.root).getBlock(this.referencedBlockId);

      if (block) {
        return block.linesText;
      }
    }

    return [];
  }

}