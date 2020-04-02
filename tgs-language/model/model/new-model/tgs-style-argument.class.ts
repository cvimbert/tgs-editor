import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonProperty, JsonObject, Any } from 'json2typescript';
import { TgsValue } from './tgs-value.class';

@JsonObject("TgsStyleArgument")
export class TgsStyleArgument extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "name",
        expression: /([A-Za-z0-9]+)/,
        groups: ["value"]
      },
      {
        id: "arg",
        reference: "arg",
        iterator: "?"
      }
    ],
    sub: {
      arg: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\(/
          },
          {
            id: "value",
            reference: TgsValue
          },
          {
            id: "closer",
            expression: /\)/
          }
        ]
      }
    }
  };

  @JsonProperty("name", String, true)
  name = "";

  @JsonProperty("arg", Any, true)
  arg: any = null;

  constructObject() {
    this.name = this.getFirstValue("name@value");

    let argRes = <TgsValue>this.getFirstResult("arg/value");
    
    if (argRes) {
      this.arg = argRes.value;
    }
  }
}