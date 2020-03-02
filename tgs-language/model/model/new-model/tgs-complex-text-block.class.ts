import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';

export class TgsComplexTextBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "simpleLine",
        reference: "blockLine"
      }
    ]
  };
}