import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsBoolean } from './primitive-variables/tgs-boolean.class';
import { TgsVariableReference } from './tgs-variable-reference.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsBooleanExpression")
export class TgsBooleanExpression extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "member1",
        reference: "simpleMember",
      },
      {
        id: "member2",
        reference: "complexMember",
        iterator: "?"
      }
    ],
    sub: {
      simpleMember: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "direct",
            reference: TgsBoolean
          },
          {
            id: "variable",
            reference: TgsVariableReference
          }
        ],
      },
      complexMember: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "operator",
            expression: /(&&|\|\|)/,
            groups: ["type"]
          },
          {
            id: "complex",
            reference: TgsBooleanExpression
          }
        ]
      }
    }
  };

  @JsonProperty("vr", TgsVariableReference, true)
  variableRef: TgsVariableReference = null;

  @JsonProperty("dv", Boolean, true)
  directValue = false;

  @JsonProperty("o", String, true)
  operator = "";

  @JsonProperty("m", TgsBooleanExpression, true)
  member2: TgsBooleanExpression = null;

  constructObject() {
    let member1 = this.getFirstResult("member1");

    switch(member1.getFirstKey()) {
      case "direct":
        this.directValue = (<TgsBoolean>member1.getFirstResult("direct")).value;
        break;

      case "variable":
        this.variableRef = <TgsVariableReference>member1.getFirstResult("variable");
        break;
    }

    let mem2 = this.getFirstResult("member2");

    if (mem2) {
      this.operator = mem2.getFirstValue("operator@type");
      this.member2 = <TgsBooleanExpression>mem2.getFirstResult("complex");
    }    
  }

  evaluate(): boolean {
    
    let member1Val: boolean;

    if (this.variableRef) {
      member1Val = this.variableRef.getValue();
    } else {
      member1Val = this.directValue;
    }

    switch(this.operator) {
      case "&&":
        return member1Val && this.member2.evaluate();

      case "||":
        return member1Val || this.member2.evaluate();

      default:
        return member1Val;
    }
  }
}