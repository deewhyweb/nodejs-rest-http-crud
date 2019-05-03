const fruitsV1 = require("./v1/fruits");
const fruitsV2 = require("./v2/fruits");
const express = require('express');
const router = express.Router();
router.use('/v1', fruitsV1);
router.use('/v2', fruitsV2);
module.exports = router;