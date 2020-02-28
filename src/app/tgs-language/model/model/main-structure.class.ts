import { ScriptModel } from "./script-model.class";
import { ConditionModel } from "./condition-model.class";
import { BlockModifierModel } from "./block-modifier-model.class";
import { CompilerResult } from 'src/app/compiler/compiler-result.class';
import { GameBlockModel } from './game-block-model.class';

export class MainStructure {

  scripts: {[key: string]: ScriptModel};
  conditions: {[key: string]: ConditionModel};
  blocks: {[key: string]: GameBlockModel};
  blocksArray: GameBlockModel[] = [];
  valid: boolean;
  endIndex: number;

  // peut-être pas nécessaire si on emploie un nom spécifique pour le bloc d'entrée
  entryBlockId: string;

  static getNestedBlockId(parentId: string, nestedId: string): string {
    return parentId + "$" + nestedId;
  }

  static loadFromCompilerResult(result: CompilerResult): MainStructure {

    let conditionsResults: CompilerResult[] = result.getResults("items/condition") || [];
    let scriptResults: CompilerResult[] = result.getResults("items/script") || [];
    let blocksResults: CompilerResult[] = result.getResults("items/gameBlock") || [];

    let structure = new MainStructure();

    structure.valid = result.endIndex >= result.originalString.replace(/\s*$/, "").length;
    structure.endIndex = result.endIndex;
    
    structure.conditions = ConditionModel.loadConditionsDeclarations(conditionsResults);
    structure.scripts = ScriptModel.loadScripts(scriptResults);
    structure.blocks = GameBlockModel.loadBlocks(blocksResults);
    structure.entryBlockId = GameBlockModel.getBlockId(blocksResults[0]);

    for (let key in structure.blocks) {
      structure.blocksArray.push(structure.blocks[key]);
    }

    structure.blocksArray.forEach(block => {
      if (block.links) {
        block.links.forEach(link => {
          if (link.nestedBlock) {
            let newId = this.getNestedBlockId(block.id, link.nestedBlock.id);
            structure.blocks[newId] = link.nestedBlock;
            structure.blocksArray.push(link.nestedBlock);
          }
        });
      }
    });

    // passe de modification des blocs
    structure.blocksArray.forEach(block => {
      for (let modifierId in block.modifiers) {

        let modifier: BlockModifierModel = block.modifiers[modifierId];
        let targetBlock: GameBlockModel;

        switch(modifierId) {
          case "before":
            // texte et liens sont insérés avant le texte et les liens du bloc courant
            
            modifier.blockIds.forEach(blockId => {
              targetBlock = structure.blocks[blockId];
              block.fusionBefore(targetBlock);
            });

            // block.lines = block.line
            break;

          case "after":
            // même chose, mais après

            modifier.blockIds.forEach(blockId => {
              targetBlock = structure.blocks[blockId];
              block.fusionAfter(targetBlock);
            });

            break;
        }
      }
    });

    //console.log(structure);
    return structure;
  }
}
