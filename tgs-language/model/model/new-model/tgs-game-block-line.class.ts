import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsTemplateExpression } from './tgs-template-expression.class';
import { TgsDuration } from './tgs-duration.class';
import { TgsInlineCommand } from './tgs-inline-command.class';

@JsonObject("TgsGameBlockLine")
export class TgsGameBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "command",
        reference: TgsInlineCommand
      },
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

  @JsonProperty("ip", Boolean, true)
  isPause = false;

  @JsonProperty("pd", Number, true)
  pauseDuration = 0;

  @JsonProperty("pa", String, true)
  pauseAction = "";

  @JsonProperty("du", String, true)
  durationUnit = "ms";

  @JsonProperty("ib", Boolean, true)
  isBreak = false;

  @JsonProperty("dt", String, true)
  directText = "";

  @JsonProperty("t", TgsTemplateExpression, true)
  template: TgsTemplateExpression = null;

  @JsonProperty("c", TgsInlineCommand, true)
  command: TgsInlineCommand = null;

  constructObject() {
    this.directText = this.getFirstValue("blockline/blockline@text");
    this.template = <TgsTemplateExpression>this.getFirstResult("blockline/template");

    let firstKey = this.getFirstKey();

    this.isBreak = firstKey === "doubleBreak";
    this.isPause = firstKey === "pause";

    if (this.isPause) {
      let duration = <TgsDuration>this.getFirstResult("pause/duration");
      this.pauseDuration = duration.time;
      this.durationUnit = duration.unit;
      this.pauseAction = this.getFirstValue("pause/action@name");
    }

    if (firstKey === "command") {
      this.command = <TgsInlineCommand>this.getFirstResult("command");      
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