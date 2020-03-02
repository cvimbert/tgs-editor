import { AssertionsGroup, BaseLanguageItem } from 'tgs-compiler';

export class TgsBlockId extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    assertions: [
      {
        id: "blockId",
        expression: /\#([A-Za-z0-9]+)/,
        groups: ["id"]
      }
    ]
  };

  id: string;
}