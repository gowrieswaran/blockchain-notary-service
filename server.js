//Importing Express.js module
var express = require("express");
//Importing Bodyparser.js module
const bodyParser = require("body-parser");

/**
 * Class Definition for the REST API
 */
class BlockAPI {
  constructor() {
    this.app = express();
    this.initExpress();
    this.initExpressMiddleWare();
    this.initControllers();
    this.start();
  }

  /**
   * Initilization of the Express framework
   */

  initExpress() {
    this.app.set("port", 8000);
  }

  /**
   * Initialization of the middleware modules
   */

  initExpressMiddleWare() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }
  /**
   * Initilization of all the controllers
   */

  initControllers() {
    require("./BlockController")(this.app);
  }

  /**
   * Starting the REST Api application
   */
  start() {
    let self = this;
    this.app.listen(this.app.get("port"), () => {
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log(`Server Listening for port: ${self.app.get("port")}`);
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log(
        "Access endpoints:http://localhost:8000 GET - /block/height (or) POST - /block "
      );
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
  }
}

new BlockAPI();
