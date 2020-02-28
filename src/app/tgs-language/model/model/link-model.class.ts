import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { LinkDirectiveModel } from "./link-directive-model.class";
import { ComplexConditionModel } from "./complex-condition-model.class";
import { GameBlockModel } from "./game-block-model.class";
import { MainStructure } from "./main-structure.class";

export class LinkModel {

  text: string;
  localLinkRef: string;
  globalLinkRef: string;
  //condition: ConditionModel;
  complexCondition: ComplexConditionModel;
  directives: LinkDirectiveModel[];

  nestedBlock: GameBlockModel;

  static loadLink(result: CompilerResult, parentBlockId: string): LinkModel {

    //console.log("link", result);

    let model: LinkModel = new LinkModel();

    model.text = result.getFirstValue("simpleLinkText@text");
    
    let localRes = result.getFirstResult("link");

    //console.log(localRes);

    // pas logique de vérifier ici si on a des results dans localRes
    if (localRes && localRes.results) {
      let sres = localRes.getFirstResult("ref");

      //console.log(sres);

      if (sres) {
        model.localLinkRef = sres.groups["localRef"];
        model.globalLinkRef = sres.groups["globalRef"];

        //console.log(model);
      }
    }

    let nestedRes = result.getFirstResult("nestedBlock");

    if (nestedRes) {
      let nestedBlockId: string = nestedRes.getFirstValue("blockId/blockId@id");
      //console.log(nestedBlockId, nestedRes);
      model.nestedBlock = GameBlockModel.loadBlock(nestedRes, nestedBlockId);
      //console.log(model.nestedBlock);

      model.localLinkRef = MainStructure.getNestedBlockId(parentBlockId, nestedBlockId);
    }

    let conditionResult: CompilerResult = result.getFirstResult("modifiers/condition");

    if (conditionResult) {
      //console.log("ccc", conditionResult);
      let subRes: CompilerResult = conditionResult.getFirstResult("conditionBody");
      //console.log("sub", subRes);
      //model.condition = ConditionModel.loadCondition(subRes);

      model.complexCondition = ComplexConditionModel.loadCondition(subRes);
      //console.log("ici", model);
    }

    model.directives = LinkDirectiveModel.loadDirectives(result.getResults("modifiers/linkDirective/directives"));

    // console.log(model.directives.length);

    return model;
  }

  static loadLinks(results: CompilerResult[], parentBlockId: string): LinkModel[] {
    return results ? results.map(res => this.loadLink(res, parentBlockId)) : null;
  }

  static loadRedirection(result: CompilerResult): LinkModel {

    let model = new LinkModel();

    model.localLinkRef = result.getFirstValue("link/blockId@id");

    let conditionRes: CompilerResult = result.getFirstResult("condition/conditionBody");
    model.complexCondition = conditionRes ? ComplexConditionModel.loadCondition(conditionRes) : null;

    //console.log(result, model);

    return model;
  }

  static loadRedirections(results: CompilerResult[]): LinkModel[] {
    return results ? results.map(res => this.loadRedirection(res)) : null;
  }
}
