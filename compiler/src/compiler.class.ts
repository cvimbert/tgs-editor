import { CompilerResult } from './compiler-result.class';
import { AssertionsGroupType } from './enums/assertions-group-type.enum';
import { Assertion } from './interfaces/assertion.interface';
import { AssertionsGroup } from './interfaces/assertions-group.interface';
import { BaseLanguageItem } from './base-language-item.class';

export class Compiler {

  parseTGSString(text: string, languageElement: any): CompilerResult {
    // let container = new languageElement();
    let res = this.parseStringAt(text, languageElement, languageElement, null);
    // console.log(container);
    return res;
  }

  parseStringAt(text: string, languageElement: any, languageNode: any, container: BaseLanguageItem, index: number = 0): CompilerResult {

    let group: AssertionsGroup;
    // let nextItem: BaseLanguageItem;
    let globalResult;

    if (typeof languageElement === "string") {
      group = languageNode["assertions"].sub[languageElement];
      globalResult = new CompilerResult(text, index);

    } else {
      group = languageElement["assertions"];

      // let globalCont = new languageElement();

      // console.log(globalCont);
      // item = group.assertions;
      // console.log(item);
      globalResult = new languageElement(text, index);
      languageNode = languageElement;
    }

    if (!group) {
      console.warn("err !!!");
    }

    // pas possible de trouver un id pour le moment. D'ailleurs id pas nécessaire normalement.
    let cc = text.charAt(index);

    while(cc && cc.match(/\s/)) {
      index++;
      cc = text.charAt(index);
    }

    // on parcourt chacune des assertions du groupe. Si l'une des assertions est ok
    // (elle retourne un tableau de CompilerResult non null, on continue, récursivement)

    if (group.type === AssertionsGroupType.AND) {
      // pour étre évalué comme vrai, toutes les assertions du groupes devront avoir une évaluation positive
      // le résultat sera alors un tableau des différents résultats (un par assertion)
      let results: CompilerResult[] = [];

      for (let assertion of group.assertions) {
        let res = this.evaluateAssertion(text, assertion, languageNode, container, index);

        if (res) {
          index = res.length > 0 ? res[res.length - 1].index : index;
          // temporairement
          results.push(...res);

          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);

            // console.log(typeof assertion.reference);
            

            if (assertion.reference && typeof assertion.reference !== "string") {
              let item = new assertion.reference();
              // container.assertionsMainResults[assertion.id] = [item];
            } else {
              //
            }

          }

          globalResult.index = index;
        } else {
          return null;
        }
      }

      return globalResult;

    } else if (group.type === AssertionsGroupType.OR) {
      // un seul résultat, le premier positif de la liste (évaluation dans l'ordre du tableau)

      for (let assertion of group.assertions) {
        let res = this.evaluateAssertion(text, assertion, languageNode, container, index);

        if (res) {
          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);
            globalResult.index = res[res.length - 1].index;
          }

          return globalResult;
        }
      }

      // aucun résultat
      return null;

    } else {
      // pas de type, donc une seule assertion possible dans le groupe. Sinon erreur.
      if (group.assertions.length !== 1) {
        // console.error(`No type for group: "${ dictionaryTerm }". One and only one assertion required.`);
        console.error(`No type for group. One and only one assertion required.`);
      }

      let res = this.evaluateAssertion(text, group.assertions[0], languageNode, container, index);

      if (res && res.length > 0) {
        index = res ? res[0].index : index;

        if (res.length > 0) {
          globalResult.addResults(group.assertions[0].id, res);
        }

        return globalResult;
      }

      return null;
    }
  }

  evaluateAssertion(text: string, assertion: Assertion, languageNode: any, container: BaseLanguageItem, index: number = 0): CompilerResult[] {
    // cas d'itération: * (0 et plus), + (1 et plus), ? (0 ou 1), et defaut (1)
    let subRes: CompilerResult[] = [];
    let currentRes = this.evaluateAssertionIteration(text, assertion, languageNode, container, index);

    if (assertion.iterator === "?" || assertion.iterator === "*") {
      if (!currentRes) {
        return [];
      }
    }

    if (!currentRes && (assertion.iterator === "+" || !assertion.iterator)) {
      return null;
    }

    let count: number = 0;

    while (currentRes) {
      subRes.push(currentRes);

      if (assertion.iterator === "*" || assertion.iterator === "+") {

        let lastIndex: number = currentRes.index;
        currentRes = this.evaluateAssertionIteration(text, assertion, languageNode, container, currentRes.index);

        if (currentRes && currentRes.index === lastIndex) {
          // erreur bizarre de redondance de l'index. A voir
          break;
        }
      } else {
        break;
      }

      count++;

      // une petite sécurité qui ne devrait pas être nécessaire
      if (count > 100) {
        console.warn("!!! Exiting before compilation complete !!");
        break;
      }
    }

    return subRes;
  }

  evaluateAssertionIteration(text: string, assertion: Assertion, languageNode: any, container: BaseLanguageItem, index: number): CompilerResult {
    let croppedText = text.substring(index);

    if (assertion.expression) {

      let regExpAdditions = "^";
      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";
      
      /*this.configuration.comments.forEach(comment => {
        regExpAdditions += comment.expression.source;
      });*/

      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";

      let exp = new RegExp(regExpAdditions + assertion.expression.source);

      let expRes = exp.exec(croppedText);

      if (expRes) {
        let newIndex: number = index + expRes[0].length;

        let res: CompilerResult;

        if (!assertion.reference || typeof assertion.reference === "string") {
          res = new CompilerResult(text, newIndex);
        } else {
          res = new assertion.reference(text, newIndex);
        }

        // let res = new CompilerResult(text, newIndex);
        // let sres = new languageNode();

        // console.log(sres);
        

        // Il faut injecter le résultat dans un objet déjà instancié si il existe,
        // Sinon le créer

        // let node = new languageNode();
        // console.log(node);

        if (assertion.groups) {
          for (let i = 1; i < expRes.length; i++) {
            res.addGroupResult(assertion.groups[i - 1], expRes[i]);
          }
        }

        return res;

      } else {
        return null;
      }

    } else if (assertion.reference) {

      let targetResult = this.parseStringAt(text, assertion.reference, languageNode, container, index);
      return targetResult;
    }

    return null;
  }
}