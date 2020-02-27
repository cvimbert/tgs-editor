import { LNodeData } from 'src/app/compiler/interfaces/l-node-data.interface';
import { TgsNodesDictionary } from '../nodes-dictionary.class';

export let tgsMain: LNodeData = {
  id: "main",
  groups: {
    id: "main",
    // reference: TgsNodesDictionary.STRUCTURE_ELEMENT,
    iterator: "*"
  }
};