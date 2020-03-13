import { AssertionsGroup, BaseLanguageItem } from 'tgs-compiler';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject("TgsBlockId")
export class TgsBlockId extends BaseLanguageItem {

  static assertions: AssertionsGroup = {
    assertions: [
      {
        id: "blockId",
        expression: /\#([A-Za-z0-9]+)/,
        groups: ["id"]
      }
    ]
  };

  @JsonProperty("id", String, true)
  id = "";
  
  constructObject() {
    this.id = this.getFirstValue("blockId@id");
  }
}