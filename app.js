"use strict";

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const debug = require('debug')('nodejs-rest-http-crud:server');
const http = require('http');
const app = express();
const probe = require("kube-probe");
const db = require("./lib/db");
const routesVersioning = require('express-routes-versioning')();

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
var swaggerDefinition = {
  info: {
    // API informations (required)
    title: "Fruits", // Title (required)
    version: "0.0.1", // Version (required)
    description: "A sample RESTful API" // Description (optional)
  },
  basePath: "/" // Base path (optional)
};

// Options for the swagger docs
var options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: ["./lib/routes/fruits.js"]
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const fruitsV1 = require("./lib/routes/v1/fruits");
const fruitsV2 = require("./lib/routes/v2/fruits");

app.use(bodyParser.json());
app.use((error, req, res, next) => {
  if (
    req.body === "" ||
    (error instanceof SyntaxError && error.type === "entity.parse.failed")
  ) {
    res.status(415);
    return res.send("Invalid payload!");
  }

  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// Expose the license.html at http[s]://[host]:[port]/licences/licenses.html
app.use("/licenses", express.static(path.join(__dirname, "licenses")));

app.use('/api', routesVersioning({
  "1.0.0": fruitsV1,
  "^2.0.0": fruitsV2
}, fruitsV1));

// Add a health check

db.init()
  .then(() => {
    console.log("Database init'd, starting probe");
    probe(app, probeOptions);
  })
  .catch(error => {
    console.log(error);
  });

process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM. Graceful shutdown start now",
    new Date().toISOString()
  );
  db.end();
  console.info("DB Shutdown");
});

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

