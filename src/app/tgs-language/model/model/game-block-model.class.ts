import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { GameBlockLineModel } from "./game-block-line-model.class";
import { LinkModel } from "./link-model.class";
import { ScriptModel } from "./script-model.class";
import { BlockModifierModel } from "./block-modifier-model.class";

export class GameBlockModel {

  id: string;
  scripts: {[key: string]: ScriptModel};
  lines: GameBlockLineModel[] = [];
  links: LinkModel[] = [];
  redirections: LinkModel[];
  modifiers: {[key: string]: BlockModifierModel};

  startIndex: number;
  endIndex: number;


  fusionBefore(target: GameBlockModel) {
    this.lines = target.lines.concat(this.lines || []);
    this.links = target.links.concat(this.links || []);
    this.redirections = target.redirections.concat(this.redirections || []);
    this.miscFusion(target);
  }

  fusionAfter(target: GameBlockModel) {
    this.lines = this.lines.concat(target ? target.lines : []);
    this.links = this.links.concat(target ? target.links : []);
    this.redirections = this.redirections.concat(target ? target.redirections : []);
    this.miscFusion(target);
  }

  miscFusion(target: GameBlockModel) {
    // scripts
    if (target && target.scripts) {
      for (let scriptId in target.scripts) {
        this.scripts[scriptId] = target.scripts[scriptId];
      }
    }
    
  }

  static loadBlocks(results: CompilerResult[]): {[key: string]: GameBlockModel} {
    let dic: {[key: string]: GameBlockModel} = {};

    results.forEach(res => {
      let id: string = res.getFirstValue("blockId/blockId@id");
      dic[id] = GameBlockModel.loadBlock(res, id);
    });

    return dic;
  }

  static loadBlock(result: CompilerResult, id: string): GameBlockModel {
    let block: GameBlockModel = new GameBlockModel();

    block.id = id;
    block.lines = GameBlockLineModel.loadLines(result.getResults("blockLines") || []);
    block.links = LinkModel.loadLinks(result.getResults("linkItems/blockLink") || [], id);
    block.redirections = LinkModel.loadRedirections(result.getResults("linkItems/directLink") || []);
    block.modifiers = BlockModifierModel.loadModifiers(result.getResults("modifiers") || []);

    block.startIndex = result.startIndex;
    block.endIndex = result.endIndex;

    //console.log(result, block.redirections);

    let scripts: CompilerResult[] = result.getResults("scripts");

    if (scripts) {
      block.scripts = ScriptModel.loadScripts(result.getResults("scripts"));
    }

    //console.log("block", result, block);

    return block;
  }

  // utile ?
  static getBlockId(result: CompilerResult): string {
    return result.getFirstValue("blockId/blockId@id");
  }
}
