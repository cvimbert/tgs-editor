import { CompilerResult } from 'tgs-compiler/index';
import { ScriptInstructionModel } from "./script-instruction-model.class";

export class ScriptModel {

  instructions: ScriptInstructionModel[];

  static loadScripts(results: CompilerResult[]): {[key: string]: ScriptModel} {

    if (!results) {
      return {};
    }

    let dic: {[key: string]: ScriptModel} = {};

    results.forEach(res => {
      dic[res.getFirstValue("scriptOpener@scriptId")] = this.loadScript(res);
    });

    return dic;
  }

  static loadScript(result: CompilerResult): ScriptModel {
    let model = new ScriptModel();
    model.instructions = ScriptInstructionModel.loadInstructions(result.getResults("commandsGroup/instructions"));
    //console.log(model, result);
    return model;
  }
}
