import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsGameBlock } from './tgs-game-block.class';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsHeaders } from './tgs-headers.class';

@JsonObject("TgsMainStructure")
export class TgsMainStructure extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "headers",
        reference: TgsHeaders,
        iterator: "?"
      },
      {
        id: "gameBlock",
        reference: TgsGameBlock,
        iterator: "*"
      }
    ]
  };

  @JsonProperty("blocks", [TgsGameBlock], true)
  blocks: TgsGameBlock[] = [];

  headers: TgsHeaders;
  extensions: TgsMainStructure[];

  constructObject() {
    this.blocks = <TgsGameBlock[]>this.getResults("gameBlock") || [];
    this.headers = <TgsHeaders>this.getFirstResult("headers");
  }

  getBlock(id: string): TgsGameBlock {
    return this.blocks.find(block => block.id === id);
  }

  get firstBlock(): TgsGameBlock {
    return this.blocks.length > 0 ? this.blocks[0] : null;
  }
  
}