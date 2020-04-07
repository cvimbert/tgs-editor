import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsBlockId } from './tgs-block-id.class';
import { JsonObject, JsonProperty } from 'json2typescript';
import { TgsConditionHeader } from './tgs-condition-header.class';
import { TgsStyleHeader } from './tgs-style-header.class';

@JsonObject("TgsLinkItem")
export class TgsLinkItem extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.OR,
    assertions: [
      {
        id: "directLink",
        reference: "directLink",
      },
      {
        id: "blockLink",
        reference: "blockLink",
      }
    ],
    sub: {
      directLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\*/
          },
          {
            id: "condition",
            reference: TgsConditionHeader,
            iterator: "?"
          },
          {
            id: "arrow",
            expression: /=>/
          },
          {
            id: "link",
            reference: TgsBlockId,
            iterator: "?"
          }
        ]
      },
      blockLink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "opener",
            expression: /\*/
          },
          {
            id: "condition",
            reference: TgsConditionHeader,
            iterator: "?"
          },
          {
            id: "style",
            reference: TgsStyleHeader,
            iterator: "?"
          },
          {
            id: "simpleLinkText",
            expression: /(.*?)\s*->/,
            groups: ["text"]
          },
          {
            id: "link",
            reference: "slink",
            iterator: "?"
          }
        ]
      },
      slink: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "ref",
            expression: /([A-Za-z0-9-/]+)?(?:#([A-Za-z0-9-]+))?/,
            groups: ["globalRef", "localRef"]
          }
        ]
      },
    }
  };

  @JsonProperty("t", String, true)
  text = "";

  @JsonProperty("ll", String, true)
  localLinkRef = "";

  @JsonProperty("gl", String, true)
  globalLinkRef = "";

  @JsonProperty("c", TgsConditionHeader, true)
  condition: TgsConditionHeader = null;

  @JsonProperty("s", TgsStyleHeader, true)
  style: TgsStyleHeader = null;

  constructObject() {
    this.text = this.getFirstValue("blockLink/simpleLinkText@text");
    this.localLinkRef = this.getFirstValue("blockLink/link/ref@localRef");
    this.globalLinkRef = this.getFirstValue("blockLink/link/ref@globalRef");

    if (this.localLinkRef) {
      this.condition = <TgsConditionHeader>this.getFirstResult("blockLink/condition");
      this.style = <TgsStyleHeader>this.getFirstResult("blockLink/style");
    }

    if (this.globalLinkRef) {
      this.condition = <TgsConditionHeader>this.getFirstResult("directLink/condition");
    }
  }
}