import { CompilerResult } from './compiler-result.class';
import { ParserConfiguration } from './interfaces/parser-configuration.interface';
import { AssertionsGroupType } from './enums/assertions-group-type.enum';
import { Assertion } from './interfaces/assertion.interface';
import { AssertionsGroup } from './interfaces/assertions-group.interface';

export class Compiler {

  constructor(
    private configuration: ParserConfiguration
  ) {}

  parseTGSString(text: string): CompilerResult {

    // A voir si c'est utile
    // text = text.replace(/\r?\n|\r/g, "\n");

    let res = this.parseStringAt(text, this.configuration.entry);
    return res;
  }

  //
  parseTGSStringNew(text: string, languageElement: any): CompilerResult {
    let res = this.parseStringAtNew(text, languageElement, languageElement["assertions"]);
    return res;
  }

  parseStringAtNew(text: string, languageElement: any, lastGroup: AssertionsGroup, index: number = 0): CompilerResult {

    let group: AssertionsGroup;

    if (typeof languageElement === "string") {
      group = lastGroup.sub[languageElement];
    } else {
      group = languageElement["assertions"];
      lastGroup = group;

      if (!group) {
        console.warn("err !!!");
      }
    }

    // pas possible de trouver un id pour le moment. D'ailleurs id pas nécessaire normalement.
    let globalResult = new CompilerResult(text, index);

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
        let res = this.evaluateAssertionNew(text, assertion, lastGroup, index);

        if (res) {
          index = res.length > 0 ? res[res.length - 1].index : index;
          // temporairement
          results.push(...res);

          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);
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
        let res = this.evaluateAssertionNew(text, assertion, lastGroup, index);

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

      let res = this.evaluateAssertionNew(text, group.assertions[0], lastGroup, index);

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

  evaluateAssertionNew(text: string, assertion: Assertion, lastGroup: AssertionsGroup, index: number = 0): CompilerResult[] {
    // cas d'itération: * (0 et plus), + (1 et plus), ? (0 ou 1), et defaut (1)
    let subRes: CompilerResult[] = [];
    let currentRes = this.evaluateAssertionIterationNew(text, assertion, lastGroup, index);

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
        currentRes = this.evaluateAssertionIterationNew(text, assertion, lastGroup, currentRes.index);

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

  evaluateAssertionIterationNew(text: string, assertion: Assertion, lastGroup: AssertionsGroup, index: number): CompilerResult {
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

        let res = new CompilerResult(text, newIndex);

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

      let targetResult = this.parseStringAtNew(text, assertion.reference, lastGroup, index);
      return targetResult;
    }

    return null;
  }
  //

  parseStringAt(text: string, dictionaryTerm: string, index: number = 0): CompilerResult {
    let group = this.configuration.dictionary[dictionaryTerm];

    // pas possible de trouver un id pour le moment. D'ailleurs id pas nécessaire normalement.
    let globalResult = new CompilerResult(text, index);

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
        let res = this.evaluateAssertion(text, assertion, index);

        if (res) {
          index = res.length > 0 ? res[res.length - 1].index : index;
          // temporairement
          results.push(...res);

          if (res.length > 0) {
            globalResult.addResults(assertion.id, res);
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
        let res = this.evaluateAssertion(text, assertion, index);

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
        console.error(`No type for group: "${ dictionaryTerm }". One and only one assertion required.`);
      }

      let res = this.evaluateAssertion(text, group.assertions[0], index);

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

  evaluateAssertion(text: string, assertion: Assertion, index: number = 0): CompilerResult[] {
    // cas d'itération: * (0 et plus), + (1 et plus), ? (0 ou 1), et defaut (1)
    let subRes: CompilerResult[] = [];
    let currentRes = this.evaluateAssertionIteration(text, assertion, index);

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
        currentRes = this.evaluateAssertionIteration(text, assertion, currentRes.index);

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

  evaluateAssertionIteration(text: string, assertion: Assertion, index: number): CompilerResult {
    let croppedText = text.substring(index);

    if (assertion.expression) {

      let regExpAdditions = "^";
      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";
      
      this.configuration.comments.forEach(comment => {
        regExpAdditions += comment.expression.source;
      });

      regExpAdditions += !assertion.leaveStartSpaces ? "\\s*" : "";

      let exp = new RegExp(regExpAdditions + assertion.expression.source);

      let expRes = exp.exec(croppedText);

      if (expRes) {
        let newIndex: number = index + expRes[0].length;

        let res = new CompilerResult(text, newIndex);

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

      let targetResult = this.parseStringAt(text, assertion.reference, index);
      return targetResult;
    }

    return null;
  }

  verifyConfigurationIntegrity(): boolean {
    if (!this.configuration.dictionary[this.configuration.entry]) {
      console.warn(`Entry: "${this.configuration.entry}" unknown in syntax dictionary`);
      return false;
    }

    for (let dicKey in this.configuration.dictionary) {
      for (let assertion of this.configuration.dictionary[dicKey].assertions) {
        if (assertion.reference && !this.configuration.dictionary[assertion.reference]) {
          console.warn(`Unknown key "${assertion.reference}" in syntax dictionary`);
          return false;
        }
      }
    }

    // on doit aussi vérifier qu'il n'y a pas deux fois le même id dans un groupe d'assertions

    return true;
  }
}