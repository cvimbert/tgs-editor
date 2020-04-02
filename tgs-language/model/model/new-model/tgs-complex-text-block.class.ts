import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsGameBlockLine } from './tgs-game-block-line.class';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsStyleHeader } from './tgs-style-header.class';
import { TgsStyleArgument } from './tgs-style-argument.class';

@JsonObject("TgsComplexTextBlock")
export class TgsComplexTextBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "lineInBrackets",
        reference: "lineInBrackets"
      },
      {
        id: "simpleLine",
        reference: TgsGameBlockLine
      }
    ],
    sub: {
      lineInBrackets: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "open",
            expression: /\[/
          },
          {
            id: "style",
            reference: TgsStyleHeader,
            iterator: "?"
          },
          {
            id: "line",
            reference: TgsComplexTextBlock,
            iterator: "*"
          },
          {
            id: "close",
            expression: /]/
          }
        ]
      }
    }
  };

  // Bizarre, cet array, vu qu'il ne peut y avoir qu'une ligne...
  @JsonProperty("lines", [TgsGameBlockLine], true)
  lines: TgsGameBlockLine[] = [];

  @JsonProperty("subBlocks", [TgsComplexTextBlock], true)
  subBlocks: TgsComplexTextBlock[];

  @JsonProperty("styles", TgsStyleHeader, true)
  styles: TgsStyleHeader = null;

  constructObject() {
    let firstKey = this.getFirstKey();
    
    switch(firstKey) {
      case "simpleLine":
        this.lines = <TgsGameBlockLine[]>this.getResults("simpleLine");    
        break;

      case "lineInBrackets":        
        this.subBlocks = <TgsComplexTextBlock[]>this.getResults("lineInBrackets/line");
        this.styles = <TgsStyleHeader>this.getFirstResult("lineInBrackets/style");
        break;
    }
  }

  get texts(): string[] {
    let texts: string[] = [];
    this.lines.forEach(line => texts.push(...line.texts));
    return texts;
  }
}