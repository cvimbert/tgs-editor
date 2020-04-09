import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { ValueProvider } from '../interfaces/value-provider.interface';
import { TgsVariableReference } from './tgs-variable-reference.class';
import { TgsValue } from './tgs-value.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsGenericValue")
export class TgsGenericValue extends BaseLanguageItem implements ValueProvider {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "variable",
        reference: TgsVariableReference
      },
      {
        id: "value",
        reference: TgsValue
      }
    ]
  };

  @JsonProperty("r", TgsVariableReference, true)
  variableRef: TgsVariableReference = null;

  @JsonProperty("v", TgsValue, true)
  directValue: TgsValue = null;

  constructObject() {
    this.variableRef = <TgsVariableReference>this.getFirstResult("variable");
    this.directValue = <TgsValue>this.getFirstResult("value");
  }

  getObjectValue(): any {
    let item: ValueProvider = this.variableRef ? this.variableRef : this.directValue;
    return item.getObjectValue();
  }
}