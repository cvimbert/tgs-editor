import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsStyleBlock } from './tgs-style-block.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsStyleDeclaration")
export class TgsStyleDeclaration extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /@style\s*\{/
      },
      {
        id: "blocks",
        reference: TgsStyleBlock,
        iterator: "*"
      },
      {
        id: "closer",
        expression: /\}/
      }
    ]
  };

  @JsonProperty("b", [TgsStyleBlock], true)
  blocks: TgsStyleBlock[] = [];

  constructObject() {
    this.blocks = <TgsStyleBlock[]>this.getResults("blocks");
  }
}