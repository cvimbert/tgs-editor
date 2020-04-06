import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType, CompilerResult } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsStyleArgument } from './tgs-style-argument.class';

@JsonObject("TgsStyleHeader")
export class TgsStyleHeader extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /\</
      },
      {
        id: "l1",
        reference: "argWithComma",
        iterator: "*"
      },
      {
        id: "l2",
        reference: TgsStyleArgument
      },
      {
        id: "closer",
        expression: /\>/
      }
    ],
    sub: {
      argWithComma: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "arg",
            reference: TgsStyleArgument
          },
          {
            id: "comma",
            expression: /,/
          }
        ]
      }
    }
  };

  styles: TgsStyleArgument[] = [];

  @JsonProperty("bs", [String], true)
  basicStyles: string[] = [];

  @JsonProperty("td", Number, true)
  typewritingDelay = -1;

  constructObject() {
    let l1 = <TgsStyleArgument[]>this.getResults("l1/arg");
    let l2 = <TgsStyleArgument>this.getFirstResult("l2");
    
    if (l1) {
      this.styles.push(...l1);
    }

    this.styles.push(l2);

    var stylesWhiteList = ["b", "i"];

    this.basicStyles = this.styles.filter(style => stylesWhiteList.indexOf(style.name) !== -1).map(style => style.name);
    
    let delayArg = this.getArg("delay");

    if (delayArg) {
      this.typewritingDelay = delayArg.arg;      
    }
  }

  getArg(name: string): TgsStyleArgument {
    return this.styles.find(style => style.name === name);
  }
}