import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsTemplateExpression } from './tgs-template-expression.class';
import { TgsDuration } from './tgs-duration.class';

@JsonObject("TgsGameBlockLine")
export class TgsGameBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "pause",
        reference: "pause"
      },
      {
        id: "doubleBreak",
        expression: /-{4,}/
      },
      {
        id: "blockline",
        reference: "blockLine2"
      }
    ],
    sub: {
      pause: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "pauseHeader",
            expression: /\+{4,}/
          },
          {
            id: "duration",
            reference: TgsDuration
          },
          {
            id: "action",
            expression: /\[([A-Za-z]+)\]/,
            groups: ["name"],
            iterator: "?"
          }
        ]
      },
      blockLine2: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "blockline",
            expression: /(?!#|\s*\{|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>\{])/,
            groups: ["text"]
          },
          {
            id: "template",
            reference: TgsTemplateExpression
          }
        ]
      }
    }
  };

  @JsonProperty("isPause", Boolean, true)
  isPause = false;

  @JsonProperty("pauseDuration", Number, true)
  pauseDuration = 0;

  @JsonProperty("pauseAction", String, true)
  pauseAction = "";

  @JsonProperty("durationUnit", String, true)
  durationUnit = "ms";

  @JsonProperty("isBreak", Boolean, true)
  isBreak = false;

  @JsonProperty("directText", String, true)
  directText = "";

  @JsonProperty("template", TgsTemplateExpression, true)
  template: TgsTemplateExpression = null;

  constructObject() {
    this.directText = this.getFirstValue("blockline/blockline@text");
    this.template = <TgsTemplateExpression>this.getFirstResult("blockline/template");

    this.isBreak = this.getFirstKey() === "doubleBreak";
    this.isPause = this.getFirstKey() === "pause";

    if (this.isPause) {
      let duration = <TgsDuration>this.getFirstResult("pause/duration");
      this.pauseDuration = duration.time;
      this.durationUnit = duration.unit;
      this.pauseAction = this.getFirstValue("pause/action@name");
    }
  }

  get texts(): string[] {
    if (this.directText != undefined) {
      return [this.directText];
    } else if (this.template) {
      return this.template.texts;
    }
  }
}