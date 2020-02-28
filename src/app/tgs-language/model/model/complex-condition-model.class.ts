import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { ConditionModel } from "./condition-model.class";

export class ComplexConditionModel {

    operand1: ConditionModel;
    operand2: ComplexConditionModel;
    operator: string;

    simpleCondition: ConditionModel;

    negated: boolean;

    static loadCondition(result: CompilerResult): ComplexConditionModel {

        let model = new ComplexConditionModel();

        model.negated = !!result.getFirstResult("negated");

        let condResult = result.getFirstResult("element");
        let type = condResult.getFirstKey();

        switch (type) {
            case "expression":
                this.loadOperands(model, condResult.getFirstResult("expression"));
                break;

            case "expressionInParenthesis":
                this.loadOperands(model, condResult.getFirstResult("expressionInParenthesis/expression"));
                break;

            case "conditionGroup":
                model.simpleCondition = ConditionModel.loadCondition(condResult);
                //console.log(model);
                break;
        }

        return model;
    }

    static loadOperands(model: ComplexConditionModel, result: CompilerResult) {
        model.operand1 = ConditionModel.loadCondition(result.getFirstResult("operand1"));
        model.operand2 = this.loadCondition(result.getFirstResult("operand2"));
        model.operator = result.getFirstResult("operator").getFirstKey();
    }
}