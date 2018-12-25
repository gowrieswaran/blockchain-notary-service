/**********************************************************************
*** Blockchain Class for new BlockChain                           *****
***********************************************************************/

const SHA256 = require("crypto-js/sha256");
const LevelSandbox = require("./LevelSandbox.js");
const Block = require("./Block.js");

// global variable to hold the height of the chain(value assigned using getBlocksCount())
let heightOfTheChain = 0;

/**********************************************************************
*** @constructor - BlockChain                                      ****
***********************************************************************/

class Blockchain {
  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

/**********************************************************************
*** Method to create Genesis Block (always with height= 0)         ****
***********************************************************************/
  generateGenesisBlock() {

    this.getBlockHeight().then(height => {
      if (height === 0) {
        let genesisBlock = new Block.Block(
          "First Block in the chain - Genesis Block"
        );
        genesisBlock.time = new Date()
          .getTime()
          .toString()
          .slice(0, -3);
        genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
        this.bd.addLevelDBData(height, JSON.stringify(genesisBlock).toString());
      }
    });
  }

/***********************************************************************
*** Method to get block height(height of the blockchain)            ****
*** @returns a Promise                                              ****
************************************************************************/

  getBlockHeight() {

    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .getBlocksCount()
        .then(height => {
          heightOfTheChain = height;
          resolve(height);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

/***********************************************************************
*** Method to get block data by passing the block (height)          ****
*** @param {height}                                                 ****
*** @returns a Promise {Blockdata}                                  ****
************************************************************************/

  getBlock(height) {

    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .getLevelDBData(height)
        .then(value => {
          /*  console.log(
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
              " Block #" +
              height +
              "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
          );*/
          //console.log(JSON.parse(value));
          resolve(JSON.parse(value));
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

/***********************************************************************
*** Method to add block to the blockchain by passing the block      ****
*** @param {block}                                                  ****
*** @returns a Promise                                              ****
************************************************************************/

  addBlock(block) {

    let self = this;
    return new Promise((resolve, reject) => {
      self
        .getBlockHeight()
        .then(height => {
          block.height = height;
          block.time = new Date()
            .getTime()
            .toString()
            .slice(0, -3);
          if (block.height > 0) {
            self
              .getBlock(block.height - 1)
              .then(value => {
                block.previousBlockHash = value.hash;
                block.hash = SHA256(JSON.stringify(block)).toString();
                self.bd.addLevelDBData(
                  block.height,
                  JSON.stringify(block).toString()
                );
                resolve(block);
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

/***********************************************************************
*** Method to validate block data by passing the block height       ****
*** @param {height}                                                 ****
*** @returns a Promise                                              ****
************************************************************************/

  validateBlock(height) {
    let self = this;
    return new Promise((resolve, reject) => {
      self
        .getBlock(height)
        .then(blockData => {
          //get block object
          let block = blockData;
          //get block hash
          let blockHash = block.hash;
          // remove block hash to test block integrity
          block.hash = "";
          //generate block hash
          let validBlockHash = SHA256(JSON.stringify(block)).toString();
          //compare hash to validate block
          if (blockHash === validBlockHash) {

            /* console.log(
              "```````````````````````````````````````````````````````````````````"
            );
            console.log(
              "Block #" +
                blockData.height +
                " - Valid hash \n" +
                "``````````````````````````````````````````````````````````````````` \n" +
                blockHash +
                "\n" +
                " == " +
                "\n" +
                validBlockHash
            );*/
            resolve(true);
          } else {
            /* console.log(
              "```````````````````````````````````````````````````````````````````"
            );
            console.log(
              "Block #" +
                blockData.height +
                " - Invalid hash \n" +
                "``````````````````````````````````````````````````````````````````` \n" +
                blockHash +
                "\n" +
                " <>" +
                "\n" +
                validBlockHash
            );*/
          }
          resolve(false);
        })
        .catch(err => {
          console.log("Error in getBlock in ValidateBlock" + err);
          reject(err);
        });
    });
  }

/***********************************************************************
*** Utility Method to modify block by passing the (height,block)    ****
***------------------ONLY FOR TESTING PURPOSE---------------------- ****
*** @param {height,block}                                           ****
*** @returns a Promise                                              ****
************************************************************************/

  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .addLevelDBData(height, JSON.stringify(block).toString())
        .then(blockModified => {
          resolve(blockModified);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

/*************************************************************************
***** Method to delete all the data in the database                   ****
*****------------------ONLY FOR TESTING PURPOSE---------------------- ****
***** @returns a Promise                                              ****
/*************************************************************************/

  /*
  clearDBData() {
    let self = this;
    self
      .getBlockHeight()
      .then(height => {
        for (let i = 0; i <= height; i++) {
          self.bd
            .delLevelDBData(i)
            .then(key => {
              console.log("Deleted Block #" + key);
              //resolve(key);
            })
            .catch(err => {
              console.log("Error deleting Block", err);
              reject(err);
            });
        }
        //resolve(i);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  } */

/**************************************************************************
*** Method to validate link between the blocks by passing block height ****
**** @param {height}                                                 *******
**** @returns a Promise                                              *******
****************************************************************************/

  validateBlockLink(height) {
    let self = this;
    return new Promise((resolve, reject) => {
      self
        .validateBlock(height)
        .then(isValidBlock => {
          if (!isValidBlock) {
            //console.log("Block # " + height + " is Invalid");
            resolve(false);
          } else {
            self
              .getBlock(height)
              .then(currentBlock => {
                let currentBlockHash = currentBlock.hash;
                // to validate the last block(heightOfTheChain - global variable)
                // holds the height of the blockchain (value assigned using getblockscount)
                if (height + 1 === heightOfTheChain) {
                  /* console.log(
                    "Last block of the chain- hash links not checked",
                    height
                  );*/
                  resolve(true);
                } else {
                  self
                    .getBlock(height + 1)
                    .then(nextBlock => {
                      let prevBlockHash = nextBlock.previousBlockHash;
                      if (currentBlockHash !== prevBlockHash) {
                        // console.log(
                        //   "Block # " + height + " has a Invalid hash link"
                        // );
                        resolve(false);
                      } else {
                        // console.log(
                        //   "Block # " + height + " has a valid hash link"
                        // );
                        resolve(true);
                      }
                    })
                    .catch(err => {
                      console.log("Error in nextblock ");
                      reject(err);
                    });
                }
              })
              .catch(err => {
                console.log("error in current block");
                reject(err);
              });
          }
          //resolve(true);
        })

        .catch(err => {
          console.log("Error in calling validate block");
          reject(err);
        });
    });
  }

/*************************************************************************
***** Method to validate the entire BlockChain                        ****
***** @returns a Promise                                              ****
**************************************************************************/

  validateBlockChain() {
    let self = this;
    let promiseArray = [];
    let chainInvalid = false;
    return new Promise((resolve, reject) => {
      self
        .getBlockHeight()
        .then(height => {
          for (let i = 0; i < height; i++) {
            promiseArray.push(self.validateBlockLink(i));
          }
          console.log(
            "---------------------------------Start of Validating Chain-----------------------------------------\n"
          );
          Promise.all(promiseArray)
            .then(values => {
              values.forEach((value, i) => {
                if (value === false) {
                  chainInvalid = true;
                  console.log("The Tampered block/link - Block # ", i);
                  console.log(
                    "```````````````````````````````````````````````````````````````````"
                  );
                  // resolve(false);
                } else {
                  // resolve("All Blocks are validated in the blockchain");
                  //resolve(true);
                }
              });
              if (chainInvalid) {
                console.log(
                  "**************************************************************************************************"
                );
                console.log(
                  "The Blockchain is Invalid because either the block(s) above has been tampered or the link has been broken \n"
                );
               }
               else {
                 console.log(
                   "**************************************************************************************************"
                 );
                 console.log(
                   "The Blockchain is Valid!!! - All the blocks and links between the blocks are validated successfully!!!\n"
                 );
               }
              resolve(values);
            })
            .catch(err => {
              console.log("Error in promise all");
              reject(err);
            });
        })
        .catch(err => {
          console.log("Error in block height");
          reject(err);
        });
    });
  }

/*************************************************************************
***** Method to print entire block chain                              ****
**************************************************************************/

  printEntireDB() {
    this.bd.getAllBlocks();
  }

}

module.exports.Blockchain = Blockchain;
