import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsVariableReference } from './tgs-variable-reference.class';
import { TgsValue } from './tgs-value.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsAssignation")
export class TgsAssignation extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /\>\>/
      },
      {
        id: "variable",
        reference: TgsVariableReference
      },
      {
        id: "operator",
        expression: /=/
      },
      {
        id: "value",
        reference: TgsValue
      }
    ]
  };

  @JsonProperty("vr", TgsVariableReference, true)
  variable: TgsVariableReference = null;

  @JsonProperty("vl", TgsValue, true)
  value: TgsValue;

  constructObject() {
    this.variable = <TgsVariableReference>this.getFirstResult("variable");
    this.value = <TgsValue>this.getFirstResult("value");
    
  }
}