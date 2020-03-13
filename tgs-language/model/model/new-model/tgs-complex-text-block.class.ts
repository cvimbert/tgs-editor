import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsGameBlockLine } from './tgs-game-block-line.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsComplexTextBlock")
export class TgsComplexTextBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "simpleLine",
        reference: TgsGameBlockLine
      }
    ]
  };

  @JsonProperty("line", [TgsGameBlockLine], true)
  lines: TgsGameBlockLine[] = [];

  constructObject() {
    this.lines = <TgsGameBlockLine[]>this.getResults("simpleLine");    
  }

  get texts(): string[] {
    let texts: string[] = [];
    this.lines.forEach(line => texts.push(...line.texts));
    return texts;
  }
}