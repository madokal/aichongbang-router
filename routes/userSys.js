var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//供应商管理
router.post("/", async function(req, res) {
    res.send("wsd")
});
module.exports = router;