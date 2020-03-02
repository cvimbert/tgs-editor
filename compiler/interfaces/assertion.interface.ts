export interface Assertion {
  id: string;
  expression?: RegExp;
  groups?: string[];
  reference?: any;
  iterator?: string;
  leaveStartSpaces?: boolean;
}
