//Importing Express.js module
const express = require("express");
const app = express();

//Importing Bodyparser.js module
const bodyParser = require("body-parser");
const BlockChain = require("./BlockChain.js");
const Block = require("./Block.js");
const bitcoinMessage = require("bitcoinjs-message");
const hex2ascii = require("hex2ascii");

let myBlockChain = new BlockChain.Blockchain();
const port = process.env.PORT || 8000;
const TimeoutRequestsWindowTime = 5 * 60 * 1000;

var mempool = [];
var validRequests = [];

/*Add a request validation*/
function addARequestValidation(address, reqTime) {
  let message = `${address}:${reqTime}:starRegistry`;
  if (checkAddrExists(address) === false) {
    let requestObject = {
      walletAddress: address,
      requestTimeStamp: reqTime,
      message: message,
      validationWindow: 300
    };
    mempool.push(requestObject);
    return requestObject;
  } else {
    for (i = 0; i < mempool.length; i++) {
      if (mempool[i].walletAddress === address) {
        mempool[i].validationWindow = getTimeLeft(mempool[i].requestTimeStamp);
        if (mempool[i].validationWindow <= 0) {
          removeMempoolObj(address);
          return "Window expired";
        }
        return mempool[i];
      }
    }
  }
}
/*Get the time window left for completing the validation of given wallet address */
function getTimeLeft(requestTimeStamp) {
  let timeElapse =
    new Date()
      .getTime()
      .toString()
      .slice(0, -3) - requestTimeStamp;
  let timeLeft = TimeoutRequestsWindowTime / 1000 - timeElapse;

  return timeLeft;
}
/*Check if the wallet address exists already */
function checkAddrExists(address) {
  let isExist = false;
  if (mempool.length === 0) {
    isExist = false;
  } else {
    for (i = 0; i < mempool.length; i++) {
      if (mempool[i].walletAddress === address) {
        isExist = true;
      }
    }
  }
  return isExist;
}
/*check if window time expired for a given address */
function checkValWindowExpired(address) {
  let isExpired = false;
  for (i = 0; i < mempool.length; i++) {
    if (mempool[i].walletAddress === address) {
      let requestTime = mempool[i].requestTimeStamp;
      if (getTimeLeft(requestTime) <= 0) {
        isExpired = true;
      }
    }
  }
  return isExpired;
}

/*check if the electrum wallet signature is valid*/
function validateSign(address, sign) {
  /*verify window time*/
  let isValidSign = false;
  let reqObj, msg;
  if (!checkValWindowExpired(address)) {
    reqObj = getAddrReqObject(address);
    msg = reqObj.message;
    isValidSign = bitcoinMessage.verify(msg, address, sign);
  } else {
    removeMempoolObj(address);
  }

  return isValidSign;
}
/*check if the address is valid and signed*/
function checkValidSignedAddr(address) {
  let isExist = false;
  if (validRequests.length === 0) {
    isExist = false;
  } else {
    for (i = 0; i < validRequests.length; i++) {
      if (validRequests[i].walletAddress === address) {
        isExist = true;
      }
    }
  }
  return isExist;
}
/*Remove an element from mempool array based on address */
function removeMempoolObj(address) {
  for (i = 0; i < mempool.length; i++) {
    if (mempool[i].walletAddress === address) {
      mempool.splice(i, 1);
    }
  }
}
/*Remove an element from valid request array based on address */
function removeValidReqObj(address) {
  for (i = 0; i < validRequests.length; i++) {
    if (validRequests[i].walletAddress === address) {
      validRequests.splice(i, 1);
    }
  }
}
/*Get a request object from wallet address */
function getAddrReqObject(address) {
  let reqObject;
  for (i = 0; i < mempool.length; i++) {
    if (mempool[i].walletAddress === address) {
      reqObject = mempool[i];
    }
  }
  return reqObject;
}

/*Encode a Message*/
function encode(message) {
  let encodedMsg = Buffer.from(message).toString("hex");
  return encodedMsg;
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, () => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log(`Server Listening for port ${port}..`);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log(
    "Access endpoints: \n 1.http://localhost:8000/requestValidation -POST \n 2.http://localhost:8000/message-signature/validate - POST \n 3.http://localhost:8000/block -POST \n 4.http://localhost:8000/stars/hash:[hash] -GET \n 5.http://localhost:8000/stars/address:[address] - GET \n 6.http://localhost:8000/block/:height -GET"
  );
});

/**
 * Implement a POST Endpoint for request validation, url: http://localhost:8000/requestValidation
 */
app.post("/requestValidation", (req, res) => {
  const { address } = req.body;
  if (!address) {
    res.status(400).send("Send address for validation");
    return;
  }
  let reqTime = new Date()
    .getTime()
    .toString()
    .slice(0, -3);
  let requestObject = addARequestValidation(address, reqTime);
  res.send(requestObject);
});

/**
 * Implement a POST Endpoint for request validation, url: http://localhost:8000/message-signature/validate
 */
app.post("/message-signature/validate", (req, res) => {
  const { address, signature } = req.body;
  if (!address || !signature) {
    res.status(400).send("Send Address & Signature for validation");
    return;
  }
  if (!checkAddrExists(address)) {
    res.status(400).send("Send address for request validation");
    return;
  }
  if (validateSign(address, signature) === true) {
    let temp = getAddrReqObject(address);
    let validReqObj = {
      registerStar: true,
      status: {
        address: temp.walletAddress,
        requestTimeStamp: temp.requestTimeStamp,
        message: temp.message,
        validationWindow: getTimeLeft(temp.requestTimeStamp),
        messageSignature: true
      }
    };
    res.send(validReqObj);
    validRequests.push(temp);
  } else {
    res.status(400).send("bad request");
  }
});
/**
 * Implement a POST Endpoint to add star data, url: http://localhost:8000/block
 */
app.post("/block", (req, res) => {
  let dataPassed = req.body;
  if (
    !dataPassed.address ||
    !dataPassed.star.dec ||
    !dataPassed.star.ra ||
    !dataPassed.star.story
  ) {
    res.status(400).send("Not a valid star data");
    return;
  }
  if (dataPassed.star.story.length > 500) {
    res
      .status(400)
      .send("Star story is limited to limited to 250 words (500 bytes");
    return;
  }
  if (checkValidSignedAddr(dataPassed.address)) {
    let starStory = dataPassed.star.story;
    let encodeStory = encode(starStory);
    dataPassed.star.story = encodeStory;
    let addNewBlock = new Block.Block(dataPassed);
    myBlockChain
      .addBlock(addNewBlock)
      .then(result => {
        let decodeStory = hex2ascii(result.body.star.story);
        result.body.star.storydecoded = decodeStory;
        validRequests = removeValidReqObj(dataPassed.address);
        res.status(200).send(result);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  } else {
    res.status(404).send("Not a Valid Signed Address");
  }
});

/**
 * Implement a GET Endpoint for star lookup by hash, url:http://localhost:8000/stars/hash:[HASH]
 */

app.get("/stars/hash:hash", (req, res) => {
  let hash = req.params.hash;
  let hashVal = hash.substring(1);
  myBlockChain
    .getStarByHash(hashVal)
    .then(result => {
      let decodeStory = hex2ascii(result.body.star.story);
      result.body.star.storydecoded = decodeStory;
      res.status(200).send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

/*For testing*/
app.get("/", (req, res) => {
  //myBlockChain.printEntireDB();
});

/**
 * Implement a GET Endpoint to retrieve a block by index, url: "/block/:height"
 */
app.get("/block/:height", (req, res) => {
  let val = req.params.height;
  myBlockChain
    .getBlockHeight()
    .then(height => {
      if (val < height) {
        myBlockChain
          .getBlock(val)
          .then(result => {
            let decodeStory = hex2ascii(result.body.star.story);
            result.body.star.storydecoded = decodeStory;
            res.status(200).send(result);
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

/**
 * Implement a GET Endpoint for star lookup by address, url:http://localhost:8000/stars/address:[address]
 */

app.get("/stars/address:address", (req, res) => {
  let address = req.params.address;
  let addressVal = address.substring(1);
  myBlockChain
    .getStarByAddress(addressVal)
    .then(result => {
      for (let i = 0; i < result.length; i++) {
        let decodeStory = hex2ascii(result[i].body.star.story);
        result[i].body.star.storydecoded = decodeStory;
      }
      res.status(200).send(result);
    })
    .catch(err => {
      res.send(err);
    });
});
