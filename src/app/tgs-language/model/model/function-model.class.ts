import { ArgumentModel } from "../model/argument-model.class";
import { CompilerResult } from 'src/app/compiler/compiler-result.class';

export class FunctionModel {

    name: string;
    args: ArgumentModel[] = [];

    static loadFunction(result: CompilerResult): FunctionModel {
        let model = new FunctionModel();

        model.name = result.getFirstValue("functionName@name");
        model.args = ArgumentModel.loadArguments(result.getResults("arguments/argument"));

        // console.log(model);

        return model;
    }
}