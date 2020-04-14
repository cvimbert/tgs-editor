import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty, Any } from 'json2typescript';
import { TgsValue } from './tgs-value.class';

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

  constructObject() {
    this.id = this.getFirstValue("opener@name");

    let res2 = <TgsValue[]>this.getResults("argsList/argWithComma/arg");

    if (res2) {
      this.values.push(...res2.map(res => res.getObjectValue()));
    }

    let res1 = <TgsValue>this.getFirstResult("argsList/arg");
    this.values.push(res1.getObjectValue());    
  }
}