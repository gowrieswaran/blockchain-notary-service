
/**********************************************************************
 ** @constructor - Block Class for creating a Block                ****
 **********************************************************************/
class Block {
  constructor(data) {
    // Add your Block properties
    (this.hash = ""),
      (this.height = 0),
      (this.body = data),
      (this.time = 0),
      (this.previousBlockHash = "");
  }
}

module.exports.Block = Block;
