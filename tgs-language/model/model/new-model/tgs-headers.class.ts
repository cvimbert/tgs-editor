import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsString } from './tgs-string.class';
import { TgsPath } from './tgs-path.class';
import { JsonProperty, JsonObject } from 'json2typescript';
import { TgsDuration } from './tgs-duration.class';

@JsonObject("TgsHeaders")
export class TgsHeaders extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /@headers\s*\{/
      },
      {
        id: "headerLine",
        reference: "headerLine",
        iterator: "*"
      },
      {
        id: "closer",
        expression: /\}/
      }
    ],
    sub: {
      headerLine: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "nameGroup",
            expression: /([A-Za-z0-9]+)\s*:/,
            groups: ["name"]
          },
          {
            id: "argumentsList",
            reference: "argumentList",
            iterator: "*"
          },
          {
            id: "closer",
            expression: /;|\n/,
            iterator: "?"
          }
        ]
      },
      argumentList: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "simple",
            reference: "argument"
          },
          {
            id: "closer",
            expression: /,/,
            iterator: "?"
          }
        ]
      },
      argument: {
        type: AssertionsGroupType.OR,
        assertions: [
          {
            id: "duration",
            reference: TgsDuration
          },
          {
            id: "path",
            reference: TgsPath
          },
          {
            id: "string",
            reference: TgsString
          },
          {
            id: "simple",
            expression: /(.*?)(?=,|;|\n)/
          }
        ]
      }
    }
  };

  @JsonProperty("title", String, true)
  title = "";

  @JsonProperty("extensionList", [String], true)
  extensionList: string[] = [];

  @JsonProperty("defaultTimeout", Number, true)
  defaultTimeout = 0;

  // n'a pas à être serialiser
  private lines: BaseLanguageItem[] = [];


  getLine(id: string): BaseLanguageItem {
    return this.lines.find(line => line.getFirstValue("nameGroup@name") === id);
  }

  constructObject() {
    this.lines = <BaseLanguageItem[]>this.getResults("headerLine");    

    let titleLine = this.getLine("name");

    if (titleLine) {
      this.title = (<TgsString>titleLine.getFirstResult("argumentsList/simple/string")).value;      
    }

    let extensionLine = this.getLine("extends");    

    if (extensionLine) {
      let extensionItems = <TgsPath[]>extensionLine.getResults("argumentsList/simple/path");
      this.extensionList = extensionItems.map(item => item.getFullPath());
    }

    let durationLine = this.getLine("defaultTimeout");    

    if (durationLine) {
      let duration = <TgsDuration>durationLine.getFirstResult("argumentsList/simple/duration");
      this.defaultTimeout = duration.getTimeInSeconds();
    }
  }
}