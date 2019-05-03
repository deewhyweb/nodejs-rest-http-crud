const probe = require("kube-probe");
const db = require("./db");

let livenessCallback = (req, res) => {
    db.query("select now()", err => {
      if (!err) {
        res.writeHead(200);
        res.end("OK");
      } else {
        console.log("liveness not ok");
        res.writeHead(500);
        res.end("not ok");
      }
    });
  };
  const probeOptions = {
    livenessCallback: livenessCallback
  };
  
module.exports.init = function(app) {
    db.init()
  .then(() => {
    console.log("Database init'd, starting probe");
    probe(app, probeOptions);
  })
  .catch(error => {
    console.log(error);
  });
    
}
