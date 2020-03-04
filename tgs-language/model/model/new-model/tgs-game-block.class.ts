import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsBlockId } from './tgs-block-id.class';
import { TgsComplexTextBlock } from './tgs-complex-text-block.class';
import { TgsLinkItem } from './tgs-link-item.class';
import { TgsGameBlockLine } from './tgs-game-block-line.class';
import { link } from 'fs';

export class TgsGameBlock extends BaseLanguageItem {

  constructor() {
    super();
  }

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

  id: string;
  lines: TgsGameBlockLine[];
  links: TgsLinkItem[];

  fillObject() {
    super.fillObject();
    this.id = this.getFirstValue("blockId/blockId@id");
    this.lines = <TgsGameBlockLine[]>this.results["blockLines"] || [];
    this.links = <TgsLinkItem[]>this.results["linkItems"] || [];
    console.log(this);

  }

}