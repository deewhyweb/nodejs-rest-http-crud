const db = require("./db");
function onSigterm() {
    console.info(
      "Got SIGTERM. Graceful shutdown start now",
      new Date().toISOString()
    );
    db.end()
    .then(()=>{
      console.info("DB connection closed");
      process.exit(0);
    })
    .catch(err => {
      console.error("Error shutting down db");
      console.error(err);
    })

}
function expressErrorHandler (error, req, res, next) {
    if (
      req.body === "" ||
      (error instanceof SyntaxError && error.type === "entity.parse.failed")
    ) {
      res.status(415);
      return res.send("Invalid payload!");
    }
    next();
  }

  module.exports.expressErrorHandler = expressErrorHandler;
  module.exports.onSigterm = onSigterm;