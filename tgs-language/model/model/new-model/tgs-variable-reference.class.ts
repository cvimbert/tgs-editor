import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { ValueProvider } from '../interfaces/value-provider.interface';

@JsonObject("TgsVariableReference")
export class TgsVariableReference extends BaseLanguageItem implements ValueProvider {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "l1",
        reference: "itemWithPoint",
        iterator: "*"
      },
      {
        id: "l2",
        reference: "item"
      }
    ],
    sub: {
      item: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "item",
            expression: /([A-Za-z][A-Za-z0-0]*)/,
            groups: ["val"]
          }
        ]
      },
      itemWithPoint: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "item",
            reference: "item"
          },
          {
            id: "point",
            expression: /\./
          }
        ]
      }
    }
  };


  @JsonProperty("n", String, true)
  variableName = "";

  @JsonProperty("p", [String], true)
  variablePath: string[] = [];

  constructObject() {
    var l2res = this.getFirstResult("l2");

    this.variableName = l2res.getFirstValue("item@val");

    let l1res = this.getResults("l1");

    if (l1res) {
      this.variablePath = l1res.map(res => res.getFirstValue("item/item@val"));
    }    
  }

  getObjectValue(): any {
    return true;
  }
}