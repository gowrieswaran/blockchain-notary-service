/**********************************************************************
*** Use this File to Test the project                             *****
*** Uncomment each method to test functionality                   *****
***********************************************************************/

const BlockChain = require("./BlockChain.js");
const Block = require("./Block.js");

//let myBlockChain = new BlockChain.Blockchain();

/*
setTimeout(function() {
  console.log("Waiting...");
}, 100000);
*/

/**********************************************************************************
***                      Function to Create Tests Blocks                      *****
***********************************************************************************/

/*
(function theLoop(i) {
  setTimeout(function() {
    let blockTest = new Block.Block("Test Block - " + (i + 1));
    myBlockChain.addBlock(blockTest).then(result => {
      console.log(
        "```````````````````````````````````````````````````````````````````"
      );
      console.log(result);
      console.log(
        "```````````````````````````````````````````````````````````````````"
      );
      i++;
      if (i < 5) theLoop(i);
    });
  }, 100000);
})(0);
*/

/********************************************************************************
*** Function to get the Height of the Chain                                  ****
*** -------getblockheight() should return a Promise------------              ****
*** Logst the height of the blockchain                                       ****
*********************************************************************************/

/*
myBlockChain
  .getBlockHeight()
  .then(height => {
    console.log(
      "`````````````````````Height of the Chain```````````````````````````"
    );
    console.log(height);
    console.log(
      "```````````````````````````````````````````````````````````````````"
    );
  })
  .catch(err => {
    console.log(err);
  });

*/

/********************************************************************************
*** Function to get the block in the chainInvalid                            ****
*** -------getblock() should return a Promise------------                    ****
*** @params {height}                                                         ****
*** Logs the block data                                                      ****
*********************************************************************************/

/*
myBlockChain
  .getBlock(8)
  .then(block => {
    console.log("Printing the Block - 8 using getBlock()");
    console.log(
      "```````````````````````````````````````````````````````````````````"
    );
    console.log(block);
    console.log(
      "```````````````````````````````````````````````````````````````````"
    );
  })
  .catch(err => {
    console.log(err);
  });

*/

/********************************************************************************
** Method to validate block data by passing the block height                 ****
** -------validateBlock() should return a Promise------------                ****
** @param {height}                                                           ****
** Logs {Block Valid ? True : False}                                         ****
*********************************************************************************/
/*

myBlockChain
  .validateBlock(8)
  .then(valid => {
    console.log(
      "```````````````````````````````````````````````````````````````````"
    );
    console.log("Validating Block -8- Is Valid ? ", valid);
    console.log(
      "```````````````````````````````````````````````````````````````````"
    );
  })
  .catch(error => {
    console.log(error);
  });

*/

/***************************************************************************************
*** Tampering a Block this is only for the purpose of testing the validation methods ***
*** -------------------------only for testing-----------------------------           ***
*** @params getBlock{height}                                                         ***
*** @params _modifyBlock{height,data to be tampered}                                ****
*** Logs  {Valid/InValid block} after modifying data                                ****
***************************************************************************************/

/*

myBlockChain
  .getBlock(10)
  .then(block => {
    let blockAux = block;
    blockAux.body = "Tampered Block";
    myBlockChain
      ._modifyBlock(blockAux.height, blockAux)
      .then(blockModified => {
        if (blockModified) {
          myBlockChain
            .validateBlock(blockAux.height)
            .then(valid => {
              console.log(
                "`````````````Tampering Block-10-Data & Validating````````````````````````"
              );
              console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
              console.log(
                "```````````````````````````````````````````````````````````````````"
              );
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("The Block wasn't modified");
        }
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });

*/


/*****************************************************************************************
*** Tampering a Block(prevhash) only for the purpose of testing the validation methods ***
*** -------------------------only for testing-----------------------------             ***
*** @params getBlock{height}                                                           ***
*** @params _modifyBlock{height,block}                                                ****
*** Logs  {Block Modified or not} after modifying hash                                ****
*****************************************************************************************/

/*

myBlockChain
  .getBlock(8)
  .then(block => {
    let blockAux = block;
    // tampering the block's previous hash value
    blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
    myBlockChain
      ._modifyBlock(blockAux.height, blockAux)
      .then(blockModified => {
        if (blockModified) {
          console.log(
            "```````````````Tampering Block-8 PrevHash & Validate```````````````````"
          );
          console.log("The Block was modified");
          console.log(
            "```````````````````````````````````````````````````````````````````"
          );
        } else {
          console.log("The Block wasn't modified");
        }
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
*/

/***********************************************
 ************ Delete LevelDB data **************
 ************ only for testing  **************
 ***********************************************/

//myBlockChain.clearDBData();


/*************************************************
 ** Function to print the blocks in the Chain ****
 *************************************************/

/*
|--------------------Method -1 ------------------|
  myBlockChain.printEntireDB();
|------------------------------------------------|
*/

/*
/--------------------Method -2-------------------|

myBlockChain
  .getBlockHeight()
  .then(height => {
    for (let i = 0; i < height; i++) {
      myBlockChain
        .getBlock(i)
        .then(blockData => {
          console.log(
            "`````````````````````Blocks in the Chain```````````````````````````"
          );
          console.log(blockData);
        })
        .catch(err => {
          console.log("Error in getBlock-printing", err);
        });
    }
  })
  .catch(err => {
    console.log("Error in getBlock -printing blocks", err);
  });

*/

/*********************************************************************
 ** Function to validate the link between the blocks in the Chain ****
 ** @params validateBlockLink{height}                             ****
 ** Logs {Blocks with Valid/Invalid links}                        ****
 *********************************************************************/

/*

myBlockChain
  .getBlockHeight()
  .then(height => {
    for (i = 0; i < height; i++) {
      myBlockChain
        .validateBlockLink(i)
        .then(value => {
          console.log("Validating block link", value);
        })
        .catch(err => {
          console.log("Error in validateblocklink", err);
        });
    }
  })
  .catch(err => {
    console.log("Error in getblockheight", err);
  });

*/

/*********************************************************************
 ** Function to validate the entire BlockChain                    ****
 ** Logs the Valid/Invalid blocks in the chain                    ****
 *********************************************************************/

/*

myBlockChain
  .validateBlockChain()
  .then(result => {

    console.log("The list of valid(True) and Invalid(False) blocks \n");
    console.log(result);
    console.log(
      "---------------------------------End of Validating Chain--------------------------------------------"
    );
  })
  .catch(err => {
    console.error("Error in caling dateblockchain fn");
    console.log(err);
  });

*/
