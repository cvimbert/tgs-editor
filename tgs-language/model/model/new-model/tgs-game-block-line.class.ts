import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';

export class TgsGameBlockLine extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "doubleBreak",
        expression: /[\r|\n|\n\r](?:[^\n]\s*?)[\r|\n|\n\r]/
      },
      {
        id: "blockline",
        reference: "blockLine2"
      }
    ],
    sub: {
      blockLine2: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "blockline",
            expression: /(?!#|\s*\*|\s*\]|\s*\>|\s*\r\n)(.*?)(?=[\n\r\[\]\<\>])/,
            groups: ["text"]
          }
        ]
      }
    }
  };

}