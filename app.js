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
const app = express();
const probe = require("./lib/probe");
const api = require("./lib/routes/api");
const utils = require('./lib/utils');
require("./lib/swagger")(app);

app.use(bodyParser.json());
app.use(utils.expressErrorHandler);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Expose the license.html at http[s]://[host]:[port]/licences/licenses.html
app.use("/licenses", express.static(path.join(__dirname, "licenses")));
app.use("/api/", api);

// Add a health check
probe.init(app);

// setup graceful shutdown
process.on("SIGTERM", utils.onSigterm);

module.exports = app;
