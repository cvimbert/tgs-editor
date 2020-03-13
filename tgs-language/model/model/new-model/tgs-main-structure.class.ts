import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsGameBlock } from './tgs-game-block.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsMainStructure")
export class TgsMainStructure extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "gameBlock",
        reference: TgsGameBlock,
        iterator: "*"
      }
    ]
  };

  @JsonProperty("blocks", [TgsGameBlock], true)
  blocks: TgsGameBlock[] = [];

  constructObject() {
    this.blocks = <TgsGameBlock[]>this.getResults("gameBlock") || [];
  }

  getBlock(id: string): TgsGameBlock {
    return this.blocks.find(block => block.id === id);
  }

  get firstBlock(): TgsGameBlock {
    return this.blocks.length > 0 ? this.blocks[0] : null;
  }
  
}