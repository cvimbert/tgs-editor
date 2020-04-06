import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsString } from './tgs-string.class';
import { TgsPath } from './tgs-path.class';
import { JsonProperty, JsonObject } from 'json2typescript';
import { TgsDuration } from './tgs-duration.class';
import { TgsFloat } from './primitive-variables/tgs-float.class';

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
            id: "float",
            reference: TgsFloat
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

  @JsonProperty("t", String, true)
  title = "";

  @JsonProperty("el", [String], true)
  extensionList: string[] = [];

  @JsonProperty("dt", Number, true)
  defaultTimeout = 0;

  @JsonProperty("dfs", Number, true)
  defaultFontSize = -1;

  @JsonProperty("dff", String, true)
  defaultFontFamily = "";

  // n'a pas à être serialisé
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

    let fontSizeLine = this.getLine("fontSize");    

    if (fontSizeLine) {
      this.defaultFontSize = (<TgsFloat>fontSizeLine.getFirstResult("argumentsList/simple/float")).value;
    }

    let fontFamilyLine = this.getLine("fontFamily");

    if (fontFamilyLine) {
      this.defaultFontFamily = (<TgsString>fontFamilyLine.getFirstResult("argumentsList/simple/string")).value;
    }
  }
}