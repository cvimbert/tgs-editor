import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';

export class TgsString extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "opener",
        expression: /"/
      },
      {
        id: "content",
        expression: /(.*?)(?=")/,
        groups: ["value"]
      },
      {
        id: "closer",
        expression: /"/
      }
    ]
  };

  value = "";

  constructObject() {
    this.value = this.getFirstValue("content@value")
    // console.log(this);
  }
}