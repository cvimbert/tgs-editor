import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { BooleanValueModel } from "./boolean-value-model.class";

export class ConditionModel {

  conditionName: string;
  booleanValue: BooleanValueModel;
  blockId: string;
  negated: boolean = false;

  static loadCondition(result: CompilerResult): ConditionModel {
    let model: ConditionModel = new ConditionModel();

    //console.log("condition result", result);
    let booleanResult: CompilerResult[] = result.getResults("conditionGroup/booleanValue");

    if (booleanResult && booleanResult.length > 0) {
      model.booleanValue = BooleanValueModel.loadBooleanValue(booleanResult[0]);
    }

    let blockResult: CompilerResult = result.getFirstResult("conditionGroup/block");

    if (blockResult) {
      model.blockId = blockResult.getFirstValue("blockId@id")
      //console.log(model);
    }

    if (result.getFirstResult("negation")) {
      model.negated = true;
    }

    return model;
  }

  static loadConditionsDeclarations(results: CompilerResult[]): {[key: string]: ConditionModel} {
    
    let conditions: {[key: string]: ConditionModel} = {};

    results.forEach(res => {
      conditions[res.getFirstValue("conditionGroup/conditionName@name")] = this.loadCondition(res.getFirstResult("condition"));
    });

    //console.log(results, conditions);

    return conditions;
  }
}
