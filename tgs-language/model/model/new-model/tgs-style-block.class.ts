import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsStyleBlockLine } from './tgs-style-block-line.class';

@JsonObject("TgsStyleBlock")
export class TgsStyleBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /([A-Za-z0-9]+)\s*\{/,
        groups: ["blockName"]
      },
      {
        id: "lines",
        reference: TgsStyleBlockLine,
        iterator: "*"
      },
      {
        id: "closer",
        expression: /}/
      }
    ]
  };


  @JsonProperty("i", String, true)
  id = "";

  @JsonProperty("l", [TgsStyleBlockLine], true)
  lines: TgsStyleBlockLine[] = [];

  constructObject() {
    this.id = this.getFirstValue("opener@blockName");
    this.lines = <TgsStyleBlockLine[]>this.getResults("lines");

    // console.log(this);
    
  }
}