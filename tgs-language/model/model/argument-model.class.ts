import { ArgumentType } from "./enums/argument-type.enum";
import { CompilerResult } from 'tgs-compiler/index';
import { FunctionModel } from "./function-model.class";

export class ArgumentModel {

  type: ArgumentType;
  value: any;
  variableName: string;
  function: FunctionModel;

  static loadArgument(result: CompilerResult): ArgumentModel {
    let model = new ArgumentModel();

    switch(result.getFirstKey()) {
      case "string":
        model.type = ArgumentType.STRING;
        model.value = result.getFirstValue("string/value@value");
        break;
      case "number":
        model.type = ArgumentType.NUMBER;
        model.value = +result.getFirstValue("number/value@value");
        break;
      case "boolean":
        model.type = ArgumentType.BOOLEAN;
        model.value = result.getFirstValue("boolean/value@value") === "true";
        break;
      case "variable":
        model.type = ArgumentType.VARIABLE;
        model.variableName = result.getFirstValue("variable/variableName@name");
        break;
      case "function":
        model.type = ArgumentType.FUNCTION;
        model.function = FunctionModel.loadFunction(result.getFirstResult("function"));
        break;
    }

    return model;
  }

  static loadArguments(results: CompilerResult[]): ArgumentModel[] {
    if (results) {
      return results.map(res => this.loadArgument(res));
    }
  }
}
