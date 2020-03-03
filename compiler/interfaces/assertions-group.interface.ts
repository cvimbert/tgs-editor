import { AssertionsGroupType } from "../src/enums/assertions-group-type.enum";
import { Assertion } from "../src/interfaces/assertion.interface";

export interface AssertionsGroup {
  type?: AssertionsGroupType;
  assertions: Assertion[];
  sub?: { [key: string]: AssertionsGroup };
}
