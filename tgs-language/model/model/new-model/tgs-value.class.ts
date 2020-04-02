import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType, CompilerResult } from 'tgs-compiler';
import { TgsDuration } from './tgs-duration.class';
import { TgsBoolean } from './primitive-variables/tgs-boolean.class';
import { TgsString } from './tgs-string.class';
import { TgsFloat } from './primitive-variables/tgs-float.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsValue")
export class TgsValue extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "duration",
        reference: TgsDuration
      },
      {
        id: "boolean",
        reference: TgsBoolean
      },
      {
        id: "string",
        reference: TgsString
      },
      {
        id: "number",
        reference: TgsFloat
      }
    ]
  };

  @JsonProperty("type", String, true)
  type: string = "";

  value: any;

  constructObject() {
    this.type = this.getFirstKey();
    var val = this.getFirstResult(this.type);

    switch(this.type) {
      case "duration":
        this.value = (<TgsDuration>val).getTimeInSeconds();
        break;

      case "boolean":
      case "string":
      case "number":
        this.value = (<any>val).value;
        break;
    }
  }
}