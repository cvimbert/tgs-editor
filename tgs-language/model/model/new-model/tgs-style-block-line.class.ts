import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty, Any } from 'json2typescript';
import { TgsValue } from './tgs-value.class';
import { TgsColor } from './tgs-color.class';

@JsonObject("TgsStyleBlockLine")
export class TgsStyleBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /([A-Za-z0-9]+)\s*:/,
        groups: ["name"]
      },
      {
        id: "argsList",
        reference: "args"
      },
      {
        id: "closer",
        expression: /;/
      }
    ],
    sub: {
      args: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "argWithComma",
            reference: "argWithComma",
            iterator: "*"
          },
          {
            id: "arg",
            reference: TgsValue
          }
        ]
      },
      arg: {
        type: AssertionsGroupType.AND,
        assertions: [

        ]
      },
      argWithComma: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "arg",
            reference: TgsValue
          },
          {
            id: "comma",
            expression: /,/
          }
        ]
      }
    }
  };

  @JsonProperty("i", String, true)
  id = "";

  @JsonProperty("v", Any, true)
  values: any[] = [];

  @JsonProperty("c", [TgsColor], true)
  colors: TgsColor[] = [];

  constructObject() {
    this.id = this.getFirstValue("opener@name");

    let res2 = <TgsValue[]>this.getResults("argsList/argWithComma/arg");

    if (res2) {
      res2.forEach(res => {
        this.pushVal(res);
      });
    }

    let res1 = <TgsValue>this.getFirstResult("argsList/arg");
    this.pushVal(res1);
  }

  private pushVal(res: TgsValue) {
    if (res.type === "color") {      
      this.colors.push(res.color);
    } else {
      this.values.push(res.getObjectValue());
    }
  }
}