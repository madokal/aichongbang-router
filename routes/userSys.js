var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//供应商管理
router.post("/", async function(req, res) {
    res.send("wsd")
});
//审核用户  修改门店状态
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    console.log(id )
    let data = await client.put("/users/" + id, {
        storeStatus:"已开店"
    });
    res.send(data);
});


module.exports = router;