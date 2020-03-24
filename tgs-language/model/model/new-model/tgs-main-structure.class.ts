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

  @JsonProperty("headers", TgsHeaders, true)
  headers: TgsHeaders;

  // Pas besoin d'être sérialisé... à priori
  extensions: TgsMainStructure[];

  constructObject() {
    this.blocks = <TgsGameBlock[]>this.getResults("gameBlock") || [];
    this.headers = <TgsHeaders>this.getFirstResult("headers");
  }

  getBlock(id: string): TgsGameBlock {
    // console.log("get", id, this.extensions);
    
     let block = this.blocks.find(block => block.id === id);

     if (block) {
       return block;
     } else {
       if (this.extensions) {
        for (let extension of this.extensions) {
          
          block = extension.getBlock(id);

          if (block) {
            return block;
          }
        }
       }
        
     }
  }

  get firstBlock(): TgsGameBlock {
    return this.blocks.length > 0 ? this.blocks[0] : null;
  }
  
}