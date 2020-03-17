import { BaseLanguageItem, AssertionsGroup, AssertionsGroupType } from 'tgs-compiler';

export class TgsPath extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    type: AssertionsGroupType.AND,
    assertions: [
      {
        id: "path",
        reference: "path",
        iterator: "*"
      },
      {
        id: "baseNameGroup",
        expression: /([A-Za-z0-9\.]+)/,
        groups: ["baseName"]
      }
    ],
    sub: {
      path: {
        type: AssertionsGroupType.AND,
        assertions: [
          {
            id: "val",
            expression: /([A-Za-z0-9]+)\//,
            groups: ["val"]
          }
        ]
      }
    }
  }

  baseName: string;
  folders: string[];

  separator = "/";

  getFullPath(relativeTo?: string): string {
    return (this.folders || []).join(this.separator) + this.separator + this.baseName;
  }

  constructObject() {
    this.baseName = this.getFirstValue("baseNameGroup@baseName");

    let res = this.getResults("path");

    if (res) {
      this.folders = res.map(path => path.getFirstValue("val@val"));
    }
  }
}