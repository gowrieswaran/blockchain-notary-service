/**********************************************************************
***  Persist data with LevelDB                                    *****
***********************************************************************
***  Learn more: level: https://github.com/Level/level            *****
***********************************************************************/

const level = require("level");
//configured db object and set storage location
const chainDB = "./chaindata";

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }

/*********************************************************************
***** Function to get data from LevelDB with key (promise)        ****
***** @params {key}                                               ****
***** @returns a Promises                                         ****
**********************************************************************/

  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          if (err.type == "NotFoundError") {
            resolve(undefined);
          } else {
            console.log("Block" + key + " get failed", err);
            reject(err);
          }
        } else {
          resolve(value);
        }
      });
    });
  }

/************************************************************************
***** Function to add data to LevelDB with key and value (promise)   ****
***** @params {key,value(block to be added to the db)}                ***
***** @returns a Promise                                              ***
*************************************************************************/

  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
        if (err) {
          console.log("Block " + key + " submission failed", err);
          reject(err);
        }
        resolve(value);
      });
    });
  }

/*************************************************************************
***** Function to delete LevelDB by passing key                       ****
*****------------------ONLY FOR TESTING PURPOSE---------------------- ****
**** @returns a Promise                                               ****
**************************************************************************/
  /*
  delLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      // Add your code here, remember un Promises you need to resolve() or reject()
      self.db.del(key, function(err) {
        if (err) {
          console.log("Block " + key + " deletion failed", err);
          reject(err);
        }
        resolve(key);
      });
    });
  }
*/

/**********************************************************************
*** Function to get the blockscount (height of the chain)          ****
*** @returns a Promise                                             ****
***********************************************************************/

  getBlocksCount() {
    let self = this;
    let count = 0;
    return new Promise(function(resolve, reject) {
      self.db
        .createReadStream()
        .on("data", function(data) {
          count++;
        })
        .on("error", function(err) {
          console.log("Unable to read data stream");
          reject(err);
        })
        .on("close", function() {
          //console.log("Height of the block is" + count);
          resolve(count);
        });
    });
  }

/************************************************************************
***** Function to print all the data in LevelDB                      ****
*************************************************************************/
  getAllBlocks() {
    let self = this;
    let count = 0;
    self.db.createValueStream().on("data", function(data) {
      console.log(JSON.parse(data));
    });
  }
}
module.exports.LevelSandbox = LevelSandbox;
