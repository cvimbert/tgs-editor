import { CompilerResult } from 'tgs-compiler/index';

export class BlockModifierModel {

    id: string;
    blockIds: string[];

    static loadModifiers(results: CompilerResult[]): {[key: string]: BlockModifierModel} {
        let list: {[key: string]: BlockModifierModel} = {};

        // console.log("modifiers", results);

        results.forEach(result => {
            let id = result.getFirstValue("modifierName@name");
            list[id] = this.loadModifier(id, result);
        });

        return list;
    }


    static loadModifier(id: string, result: CompilerResult): BlockModifierModel {
        let model = new BlockModifierModel();

        model.id = id;
        model.blockIds = result.getValue("blockId/blockId@id");

        // console.log(model);

        return model;
    }
}