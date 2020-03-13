import { CompilerResult } from './compiler-result.class';

export class BaseLanguageItem extends CompilerResult {

  root: any;
  
  fillObject(root: any) {
    this.root = root;
    for (let key in this.results) {
      let objArr = this.results[key];

      objArr.forEach(obj => (<BaseLanguageItem>obj).fillObject(root));
    }

    this.constructObject();
  }

  constructObject() {

  }
  
}