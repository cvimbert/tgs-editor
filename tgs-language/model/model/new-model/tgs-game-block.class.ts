import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsBlockId } from './tgs-block-id.class';
import { TgsComplexTextBlock } from './tgs-complex-text-block.class';
import { TgsLinkItem } from './tgs-link-item.class';

export class TgsGameBlock extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "blockId",
        reference: TgsBlockId
      },
      {
        id: "blockLines",
        reference: TgsComplexTextBlock,
        iterator: "*"
      },
      {
        id: "linkItems",
        reference: TgsLinkItem,
        iterator: "*"
      }
    ]
  };

}