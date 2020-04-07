import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsVariableReference")
export class TgsVariableReference extends BaseLanguageItem {

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
            expression: /([A-Za-z0-9]+)/,
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

  getValue(): any {
    return true;
  }
}