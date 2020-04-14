import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsGameBlock } from './tgs-game-block.class';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsHeaders } from './tgs-headers.class';
import { TgsStyleDeclaration } from './tgs-style-declaration.class';

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
        id: "styleDeclaration",
        reference: TgsStyleDeclaration,
        iterator: "?"
      },
      {
        id: "gameBlock",
        reference: TgsGameBlock,
        iterator: "*"
      }
    ]
  };

  @JsonProperty("b", [TgsGameBlock], true)
  blocks: TgsGameBlock[] = [];

  @JsonProperty("h", TgsHeaders, true)
  headers: TgsHeaders = null;

  @JsonProperty("s", TgsStyleDeclaration, true)
  styles: TgsStyleDeclaration = null;

  // Pas besoin d'être sérialisé... à priori
  extensions: TgsMainStructure[];

  constructObject() {
    this.blocks = <TgsGameBlock[]>this.getResults("gameBlock") || [];
    this.headers = <TgsHeaders>this.getFirstResult("headers");
    this.styles = <TgsStyleDeclaration>this.getFirstResult("styleDeclaration");
  }

  getBlock(id: string): TgsGameBlock {
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