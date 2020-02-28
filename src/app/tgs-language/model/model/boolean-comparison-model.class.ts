import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { ComparisonOperator } from "../enums/comparison-operator.enum";
import { ComparisonOperandModel } from "./comparison-operand-model.class";

export class BooleanComparisonModel {

  operand1: ComparisonOperandModel;
  operand2: ComparisonOperandModel;
  operator: ComparisonOperator;

  static loadComparison(result: CompilerResult): BooleanComparisonModel {
    let model = new BooleanComparisonModel();

    let operatorsDic: {[key: string]: ComparisonOperator} = {
      "equalsTo": ComparisonOperator.EQUALS_TO,
      "differentOf": ComparisonOperator.DIFFERENT_OF,
      "superiorTo": ComparisonOperator.SUPERIOR_TO,
      "inferiorTo": ComparisonOperator.INFERIOR_TO,
      "superiorOrEqualsTo": ComparisonOperator.SUPERIOR_OR_EQUALS_TO,
      "inferiorOrEqualsTo": ComparisonOperator.INFERIOR_OR_EQUALS_TO
    }

    model.operator = operatorsDic[result.getResults("operator")[0].getFirstKey()];
    model.operand1 = ComparisonOperandModel.loadOperand(result.getFirstResult("operand1"));
    model.operand2 = ComparisonOperandModel.loadOperand(result.getFirstResult("operand2"));

    //console.log("comparison", model);

    return model;
  }
}
