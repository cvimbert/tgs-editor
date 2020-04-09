import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsComparisonOperator")
export class TgsComparisonOperator extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "<",
        expression: /\</
      },
      {
        id: ">",
        expression: /\>/
      },
      {
        id: "<=",
        expression: /\<=/
      },
      {
        id: ">=",
        expression: /\>=/
      },
      {
        id: "==",
        expression: /==/
      },
      {
        id: "!=",
        expression: /!=/
      }
    ]
  };

  @JsonProperty("o", String, true)
  operator = "";

  constructObject() {
    this.operator = this.getFirstKey();
  }
}