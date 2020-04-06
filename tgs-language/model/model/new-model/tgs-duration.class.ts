import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsFloat } from './primitive-variables/tgs-float.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsDuration")
export class TgsDuration extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "durationValue",
        reference: TgsFloat
      },
      {
        id: "unit",
        expression: /(s|ms)/,
        groups: ["unit"],
      }
    ]
  };

  @JsonProperty("time", Number, true)
  time = 0;

  @JsonProperty("unit", String, true)
  unit = "ms";

  constructObject() {
    let floatObj = <TgsFloat>this.getFirstResult("durationValue");
    this.time = floatObj.value;

    let unitVal = this.getFirstValue("unit@unit");

    if (unitVal) {
      this.unit = unitVal;
    }
  }

  getTimeInSeconds(): number {
    return this.unit === "ms" ? this.time / 1000 : this.time;
  }
}