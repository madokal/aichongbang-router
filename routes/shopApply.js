var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//门店申请
//新增门店
router.post("/", async function (req, res) {
    let { name,
        permitNum,
        permitAddr,
        tel,
        legalPerson,
        special,
        storeStatus,
        workers,
        VIPlevel,
        commission, } = req.body;
    let data = await client.post("/stores", {
        name,
        permitNum,
        permitAddr,
        tel,
        legalPerson,
        special,
        storeStatus,
        workers,
        VIPlevel,
        commission,
    });
    res.send(data);
});
module.exports = router;