import { CompilerResult } from 'src/app/compiler/compiler-result.class';

export class TagModel {

    name: string;
    attributes: {[key: string]: string} = {};

    static loadTag(result: CompilerResult): TagModel {

        let model = new TagModel();

        model.name = result.getFirstValue("tagName@name");

        let attributesModels: CompilerResult[] = result.getResults("attributes");

        if (attributesModels) {
            attributesModels.forEach(attrModel => {
                model.attributes[attrModel.getFirstValue("attribute@attributeName")] = attrModel.getFirstValue("attribute@attributeValue");
            });
        }

        //console.log("tag", result, model);
        return model;
    }

    getAttribute(attributeName: string): string {
        return;
    }
}