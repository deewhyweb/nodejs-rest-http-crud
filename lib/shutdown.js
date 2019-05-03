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
module.exports = onSigterm;