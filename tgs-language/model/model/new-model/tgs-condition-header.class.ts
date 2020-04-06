import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsBooleanExpression } from './tgs-boolean-expression.class';

@JsonObject("TgsConditionHeader")
export class TgsConditionHeader extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /\(\?/
      },
      {
        id: "expression",
        reference: TgsBooleanExpression
      },
      {
        id: "closer",
        expression: /\)/
      }
    ]
  };

  @JsonProperty("e", TgsBooleanExpression, true)
  expression: TgsBooleanExpression;

  constructObject() {
    this.expression = <TgsBooleanExpression>this.getFirstResult("expression");    
  }

  evaluate(): boolean {
    return this.expression.evaluate();
  }
}