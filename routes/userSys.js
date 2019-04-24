var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//用户管理
router.post("/", async function (req, res) {
    res.send("wsd")
});

// 审核/拉黑用户  修改门店状态
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let storeStatus = req.body.storeStatus
    // console.log(storeStatus)
    // console.log(id )
    let data = await client.put("/users/" + id, {
        storeStatus
    });
    res.send(data);
});


module.exports = router;