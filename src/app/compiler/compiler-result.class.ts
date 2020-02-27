export class CompilerResult {
  groups: {[key: string]: string};
  results: {[key: string]: CompilerResult[]};

  startIndex: number;

  constructor(
    public originalString?: string,
    public index?: number
  ) {
    if (index !== undefined) {
      this.startIndex = index;
    }
  }

  get endIndex(): number {
    return this.index;
  }

  addGroupResult(groupName: string, value: string) {
    if (!this.groups) {
      this.groups = {};
    }

    this.groups[groupName] = value;
  }

  addResults(assertionName: string, results: CompilerResult[]) {
    if (!this.results) {
      this.results = {};
    }

    this.results[assertionName] = results;

    let newIndex = results.length > 0 ? results[results.length - 1].index : 0;

    if (this.startIndex === undefined) {
      this.startIndex = newIndex;
    }

    this.index = newIndex
  }

  getValueAtKey(key: string): string {
    return this.groups[key];
  }

  getResultsAtKey(key: string): CompilerResult[] {
    return this.results[key];
  }

  private splitPath(path: string): string[] {
    return path.split("/");
  }

  getResults(path: string): CompilerResult[] {
    return this.getResultsByArray(this.splitPath(path));
  }

  getResultsByArray(splittedPath: string[], index: number = 0): CompilerResult[] {

    let pathElem = splittedPath[index];
    let currentRes = this.getResultsAtKey(pathElem);

    if (!currentRes) return null;

    if (index === splittedPath.length - 1) {
      return this.getResultsAtKey(pathElem);
    } else {
      let results: CompilerResult[] = [];

      currentRes.forEach(res => {
        results.push(...res.getResultsByArray(splittedPath, index + 1));
      });

      return results;
    }
  }

  getFirstKey(path: string = null): string {
    if (!path) {
      if (this.results) {
        return Object.keys(this.results)[0];
      }
    } else {
      // à terminer
      //return this.getFirstValue(path)
    }
  }

  hasKey(keyName: string): boolean {
    return;
  }

  getFirstResult(path: string): CompilerResult {
    let results = this.getResults(path);
    return results ? results[0] : null;
  }

  getFirstValue(path: string): string {
    let values = this.getValue(path);
    return values ? values[0] : null;
  }

  getValue(path: string): string[] {

    if (path.indexOf("@") === -1) {
      return null;
    }

    let splitted = path.split("@");
    let pathElem = splitted[0];
    let resName = splitted[1];

    let res = this.getResults(pathElem);
    let groupsRes: string[] = [];

    if (res) {
      res.forEach(elem => {
        groupsRes.push(elem.getValueAtKey(resName));
      });
    }

    return groupsRes;
  }
}