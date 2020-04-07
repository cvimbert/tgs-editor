import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsValue } from './tgs-value.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsInlineCommand")
export class TgsInlineCommand extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /\>\>/
      },
      {
        id: "body",
        reference: "body",
        iterator: "?"
      }
    ],
    sub: {
      body: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "commandName",
            expression: /([A-Za-z0-9]+)/,
            groups: ["name"]
          },
          {
            id: "arguments",
            reference: "arguments",
            iterator: "?"
          }
        ]
      },
      arguments: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\(/
          },
          {
            id: "argsList",
            reference: "argsList",
            iterator: "?"
          },
          {
            id: "closer",
            expression: /\)/
          }
        ]
      },
      argsList: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "l1",
            reference: "argWithComma",
            iterator: "*"
          },
          {
            id: "l2",
            reference: TgsValue
          }
        ]
      },
      argWithComma: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "arg",
            reference: TgsValue
          },
          {
            id: "comma",
            expression: /,/
          }
        ]
      }
    }
  };

  @JsonProperty("cn", String, true)
  commandName = "";

  @JsonProperty("v", [TgsValue], true)
  values: TgsValue[] = [];

  constructObject() {
    this.commandName = this.getFirstValue("body/commandName@name");

    var l1 = this.getResults("body/arguments/argsList/l1/arg");
    var l2 = this.getResults("body/arguments/argsList/l2");

    this.values = <TgsValue[]>l1.concat(l2);    
  }
}