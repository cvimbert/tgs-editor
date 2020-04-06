import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsBlockId } from './tgs-block-id.class';
import { TgsComplexTextBlock } from './tgs-complex-text-block.class';
import { TgsLinkItem } from './tgs-link-item.class';
import { TgsGameBlockLine } from './tgs-game-block-line.class';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsGameBlock")
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
      // {
      //   id: "open",
      //   expression: /\[/
      // },
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

  @JsonProperty("i", String, true)
  id = "";

  @JsonProperty("cb", [TgsComplexTextBlock], true)
  complexBlocks: TgsComplexTextBlock[] = [];

  @JsonProperty("l", [TgsLinkItem], true)
  links: TgsLinkItem[] = [];

  constructObject() {
    this.id = (<TgsBlockId>this.getFirstResult("blockId")).id;
    this.complexBlocks = <TgsComplexTextBlock[]>this.getResults("blockLines") || [];
    this.links = <TgsLinkItem[]>this.getResults("linkItems") || [];
  }
  
  get linesText(): string[] {
    let texts: string[] = [];
    this.complexBlocks.forEach(line => texts.push(...line.texts));
    return texts;
  }

}