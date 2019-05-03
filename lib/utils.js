const db = require("./db");
function onSigterm() {
    console.info(
      "Got SIGTERM. Graceful shutdown start now",
      new Date().toISOString()
    );
    db.end();
    console.info("DB Shutdown");
    process.exit(0);
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