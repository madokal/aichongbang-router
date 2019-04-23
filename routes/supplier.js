var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//查询所有
router.get("/", async function (req, res) {

    console.log("11111111111111111")
    let {
        page,
        rows,
        type,
        value
    } = req.query;
    let option = {};
    if (type && value) {
        option = {
            [type]: value
        }
    }
    let data = await client.get("/providers", {
        page,
        rows,
        ...option
    });

    res.send(data);
});
//根据id查找供应商
router.get("/:id", async function (req, res) {
    let id = req.params.id;

    let data = await client.get("/providers/" + id);
    res.send(data);
    console.log(data)
});
//增加供应商
router.post("/", async function (req, res) {
    let {
        name,
        addr,
        tel,
        brand,
        product,
        time,
        price,
        produce
    } = req.body;
    let data = await client.post("/providers", {
        name,
        addr,
        tel,
        brand,
        product,
        time,
        price,
        produce
    });
    res.send(data);
});
//修改供应商
router.put("/:id", async function (req, res) {
    let {
        name,
        addr,
        tel,
        brand,
        product,
        time,
        price,
        produce
    } = req.body;
    let id = req.params.id;
    let data = await client.put("/providers/" + id, {
        name,
        addr,
        tel,
        brand,
        product,
        time,
        price,
        produce
    });
    res.send(data);

});
//删除供应商
router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    let data = await client.delete("/providers/" + id);
    res.send(data);
});

module.exports = router;