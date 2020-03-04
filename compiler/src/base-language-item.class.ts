import { CompilerResult } from './compiler-result.class';

export class BaseLanguageItem extends CompilerResult {
  
  fillObject() {
    for (let key in this.results) {
      let objArr = this.results[key];

      objArr.forEach(obj => (<BaseLanguageItem>obj).fillObject());
    }
  }
  
}