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
  id: string;

  @JsonProperty("lines", [TgsGameBlockLine], true)
  lines: TgsGameBlockLine[];

  @JsonProperty("links", [TgsLinkItem], true)
  links: TgsLinkItem[];

  fillObject() {
    super.fillObject();
    this.id = (<TgsBlockId>this.getFirstResult("blockId")).id;
    this.lines = <TgsGameBlockLine[]>this.getResults("blockLine") || [];
    this.links = <TgsLinkItem[]>this.getResults("linkItems") || [];
  }

}