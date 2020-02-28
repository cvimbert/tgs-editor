import { CompilerResult } from 'tgs-compiler/index';

export class LinkDirectiveModel {

    id: string;

    static loadDirective(result: CompilerResult): LinkDirectiveModel {
        let model = new LinkDirectiveModel();

        // le cas "basic" est le seul traité ici
        model.id = result.getFirstValue("directive/basic@name");
        
        //console.log(result, model);
        return model;
    }

    static loadDirectives(results: CompilerResult[]): LinkDirectiveModel[] {
        return results ? results.map(res => this.loadDirective(res)) : [];
    }
}