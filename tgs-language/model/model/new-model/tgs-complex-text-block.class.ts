import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';
import { TgsGameBlockLine } from './tgs-game-block-line.class';

export class TgsComplexTextBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "simpleLine",
        reference: TgsGameBlockLine
      }
    ]
  };
}