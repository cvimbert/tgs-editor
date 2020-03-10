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

  fillObject() {
    super.fillObject();
    this.lines = <TgsGameBlockLine[]>this.getResults("simpleLine");    
  }

  get texts(): string[] {
    return this.lines.map(line => line.text);
  }
}