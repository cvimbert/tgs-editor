import { AssertionsGroupType } from '../enums/assertions-group-type.enum';
import { LNodeDataGroup } from './l-node-data-group.interface';

export interface LNodeData {
  id?: string;
  type?: AssertionsGroupType;
  groups?: LNodeDataGroup | LNodeDataGroup[];
}