import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsGameBlock } from './tgs-game-block.class';

export class TgsMainStructure extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "gameBlock",
        reference: TgsGameBlock,
        iterator: "*"
      }
    ]
  };
  
}