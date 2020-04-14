import { TgsMainStructure } from '..';
import { Compiler } from 'tgs-compiler';

export class TgsManager {

  compiler = new Compiler();
  store: { [key: string] : TgsMainStructure } = {};

  constructor(
    private fs: any
  ) {}


  loadTgsString(text: string): Promise<TgsMainStructure> {

    return new Promise((resolve: (struct: TgsMainStructure) => void, reject: (err: Error) => void) => {
      let struct = <TgsMainStructure>this.compiler.parseTGSString(text, TgsMainStructure);
      struct.fillObject(struct);
    
      /*if (struct.headers && struct.headers.extensionList) {
        this.loadTgsFiles(struct.headers.extensionList).then(extensions => {
          struct.extensions = extensions;
          resolve(struct);
        }).catch((e: Error) => reject(e));
      } else {*/
        resolve(struct);
      //}
    });
  }

  loadTgsFile(path: string, useStore = false): Promise<TgsMainStructure> {
    return new Promise((resolve: (struct: TgsMainStructure) => void, reject: (err: Error) => void) => {

      if (useStore && this.store[path] !== undefined) {
        resolve(this.store[path]);
      } else {
        this.loadFile(path + ".tgs").then(text => {
          let struct = <TgsMainStructure>this.compiler.parseTGSString(text, TgsMainStructure);
          struct.fillObject(struct);
    
          this.store[path] = struct;
    
          /*if (struct.headers && struct.headers.extensionList) {
            this.loadTgsFiles(struct.headers.extensionList).then(extensions => {
              struct.extensions = extensions;
              resolve(struct);
            }).catch((e: Error) => reject(e));
          } else {
            resolve(struct);
          }*/

          resolve(struct);
  
        }).catch((e: Error) => reject(e));
      }
    });
  }

  loadTgsFiles(paths: string[]): Promise<TgsMainStructure[]> {    
    return Promise.all(paths.map(path => this.loadTgsFile(path, true)));
  }

  loadFile(path: string): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (err: Error) => void) => {
      this.fs.readFile(path, "utf8", (err: Error, data: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  clear() {
    this.store = {};
  }

}