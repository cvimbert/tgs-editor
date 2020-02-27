import { LNodeData } from './l-node-data.interface';

export interface LNodeDataGroup {
  id: string;
  expression?: RegExp;
  groups?: string[];
  reference?: LNodeData;
  iterator?: string;
  leaveStartSpaces?: boolean;
}