import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsComparisonOperator } from './tgs-comparison-operator.class';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsGenericValue } from './tgs-generic-value.class';

@JsonObject("TgsComparison")
export class TgsComparison extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "member1",
        reference: TgsGenericValue
      },
      {
        id: "operator",
        reference: TgsComparisonOperator
      },
      {
        id: "member2",
        reference: TgsGenericValue
      }
    ]
  };

  @JsonProperty("o", String, true)
  operator = "";

  @JsonProperty("m1", TgsGenericValue, true)
  member1: TgsGenericValue = null;

  @JsonProperty("m2", TgsGenericValue, true)
  member2: TgsGenericValue = null;

  constructObject() {
    this.operator = (<TgsComparisonOperator>this.getFirstResult("operator")).operator;
    this.member1 = <TgsGenericValue>this.getFirstResult("member1");
    this.member2 = <TgsGenericValue>this.getFirstResult("member2");
  }

  evaluate(): boolean {

    // à faire (fait en c#)
    return true;
  }
}