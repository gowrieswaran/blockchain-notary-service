const BlockChain = require("./BlockChain.js");
const Block = require("./Block.js");

let myBlockChain = new BlockChain.Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
  constructor(app) {
    this.app = app;
    //this.initializeMockData(); // uncomment to initialize mock data for the first time
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Help method to initialize mock dataset, adds a test block to the db
   */

  initializeMockData() {
    let createTestBlock = new Block.Block("Test Block");
    myBlockChain.addBlock(createTestBlock).then(result => {
      console.log(result);
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/block/:height"
   */

  getBlockByIndex() {
    this.app.get("/block/:height", (req, res) => {
      let val = req.params.height;
      myBlockChain
        .getBlockHeight()
        .then(height => {
          if (val < height) {
            myBlockChain
              .getBlock(val)
              .then(val => {
                res.status(200).send(val);
              })
              .catch(err => {
                res.status(404).send("Unable to retrieve block from DB");
              });
          } else {
            res.status(404).send("Block does not exist!");
          }
        })
        .catch(err => {
          res.status(404).send(err);
        });
    });
  }
  /**
   * Implement a POST Endpoint to add a new Block, url: "/block"
   */
  postNewBlock() {
    this.app.post("/block", (req, res) => {
      let dataPassed = req.body.body;
      if (dataPassed === "" || dataPassed === undefined) {
        res
          .status(400)
          .send("Pass data to the block using data payload option!");
      } else {
        let addNewBlock = new Block.Block(dataPassed);
        myBlockChain
          .addBlock(addNewBlock)
          .then(result => {
            res.status(200).send(result);
          })
          .catch(err => {
            res.status(400).send(err);
          });
      }
    });
  }
}
module.exports = app => {
  return new BlockController(app);
};
