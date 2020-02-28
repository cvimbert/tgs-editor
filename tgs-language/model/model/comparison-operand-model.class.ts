import { CompilerResult } from 'tgs-compiler/index';
import { ComparisonOperandType } from "./enums/comparison-operand-type.enum";
import { PrimitiveType } from "./enums/primitive-type.enum";

export class ComparisonOperandModel {

  type: ComparisonOperandType;

  variableName: string;

  valueType: PrimitiveType;
  value: boolean | string | number;

  static loadOperand(result: CompilerResult): ComparisonOperandModel {
    let model = new ComparisonOperandModel();

    switch(result.getFirstKey()) {
      case "variable":
        model.type = ComparisonOperandType.VARIABLE;
        model.variableName = result.getFirstValue("variable/variableName@name");
        break;
      default:
        model.type = ComparisonOperandType.VALUE;
        let type: string = result.getFirstKey();
        let value: string = result.getFirstValue(type + "/value@value");

        // pas forcément nécessaire
        if (type === "boolean") {
          model.valueType = PrimitiveType.BOOLEAN;
          model.value = value === "true";
        } else if (type === "string") {
          model.valueType = PrimitiveType.STRING;
          model.value = value;
        } else if (type === "number") {
          model.valueType === PrimitiveType.NUMBER;
          model.value = +value;
        }
    }

    //console.log("operand", result, model);

    return model;
  }
}
