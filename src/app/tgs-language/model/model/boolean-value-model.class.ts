import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { BooleanComparisonModel } from "./boolean-comparison-model.class";

export class BooleanValueModel {

  comparison: BooleanComparisonModel;

  static loadBooleanValue(result: CompilerResult): BooleanValueModel {

    let model = new BooleanValueModel();

    let comparisonResults: CompilerResult[] = result.getResults("comparison");

    if (comparisonResults) {
      model.comparison = BooleanComparisonModel.loadComparison(comparisonResults[0]);
    }

    //console.log(result);

    return model;
  }
}
