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

  @JsonProperty("id", String, true)
  id = "";

  @JsonProperty("lines", [TgsComplexTextBlock], true)
  complexBlocks: TgsComplexTextBlock[] = [];

  @JsonProperty("links", [TgsLinkItem], true)
  links: TgsLinkItem[] = [];

  fillObject() {
    super.fillObject();
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