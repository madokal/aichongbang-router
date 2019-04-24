var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//服务管理

//获取所有服务
router.get("/", async function (req, res) {
    let { page, rows, type, value, storeId } = req.query;
    let searchObj = {};
    if (type && value) {
        searchObj = { [type]: value };
    }
    let data = await client.get("/service", { "stores.$id": storeId, page, rows, submitType: "findJoin", ref: ["serviceType"], ...searchObj });
    res.send(data);
});
//获取服务类型
router.get("/serviceType", async function (req, res) {
    let { storeId } = req.query;
    let data = await client.get("/serviceType", { "stores.$id": storeId, submitType: "findJoin", ref: ["stores"], });
    res.send(data);
});
//获取服务类型  分页
router.get("/getServiceType", async function (req, res) {
    let { page, rows, type, value, storeId } = req.query;
    let searchObj = {};
    if (type && value) {
        searchObj = { [type]: value };
    }
    let data = await client.get("/serviceType", { "stores.$id": storeId, page, rows, submitType: "findJoin", ref: ["stores"], ...searchObj });
    res.send(data);
});
//添加服务
router.post("/", async function (req, res) {
    let {
        serviceTypeId,
        name,
        scheduling,
        weight,
        time,
        price,
        level,
        storeId
    } = req.body;
    await client.post("/service", {
        name,
        stores: { $ref: "stores", $id: storeId },
        serviceType: { $ref: "serviceType", $id: serviceTypeId },
        scheduling,
        weight,
        time,
        price,
        level
    });
    res.send({
        status: 1
    });
});
//添加服务类型
router.post("/serviceType", async function (req, res) {
    let {
        name,
        gold,
        platinum,
        diamond,
        storeId
    } = req.body;
    await client.post("/serviceType", {
        name,
        stores: { $ref: "stores", $id: storeId },
        priceTypes: {
            "gold": gold,
            "platinum": platinum,
            "diamond": diamond
        }
    });
    res.send({
        status: 1
    });
});
//删除服务
router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    await client.delete("/service/" + id);
    res.send({ status: 1 });
});
//根据id查询服务
router.get("/:id", async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/service/" + id, { submitType: "findJoin", ref: ["serviceType"], });
    res.send(data);

});
//修改服务
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let { serviceTypeId, name, scheduling, weight, time, price, level, stores } = req.body;
    await client.put("/service/" + id, { serviceType: { $ref: "serviceType", $id: serviceTypeId }, stores: { $ref: "stores", $id: stores.$id }, name, scheduling, weight, time, price, level });
    res.send({ status: 1 });
});
//修改服务类型
router.put("/serviceType/:id", async function (req, res) {
    let id = req.params.id;
    let { name,priceTypes } = req.body;
    await client.put("/serviceType/" + id, { name,priceTypes });
    res.send({ status: 1 });
});
//根据id查询服务类型
router.get("/serviceType/:id", async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/serviceType/" + id, { submitType: "findJoin", ref: ["stores"] });
    res.send(data);

});
//删除服务类型
router.delete("/serviceType/:id", async function (req, res) {
    let id = req.params.id;
    let {storeId} = req.body;
    let data = await client.get("/service", {"stores.$id": storeId, submitType: "findJoin", ref: ["serviceType"] });
    for (let i = 0; i < data.length; i++) {
        if (data[i].serviceType._id == id) {
            await client.delete("/service/" + data[i]._id);
        }
    }
    await client.delete("/serviceType/" + id);
    res.send({ status: 1 });
});
module.exports = router;