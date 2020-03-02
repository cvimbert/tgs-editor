import { AssertionsGroup, AssertionsGroupType, BaseLanguageItem } from 'tgs-compiler';
import { TgsBlockId } from './tgs-block-id.class';

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
  }
}