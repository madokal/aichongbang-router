var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//店铺城市分布图

// 获取各个城市的店铺数
router.get("/storeCounts", function(req,res) {
    const shops = [
        [120.33, 36.07, 10, "青岛"],
        [91.11, 29.97, 6, "拉萨"],
        [121.48, 31.22, 9, "上海"],
        [114.87, 40.82, 10, "张家口"],
        [121.56, 29.86, 2, "宁波"],
        [102.73, 25.04,15, "昆明"],
        [123.38, 41.8, 7, "沈阳"],
        [104.06, 30.67, 3, "成都"],
        [116.46, 39.92, 11, "北京"]
    ];
    res.send(shops);
});

router.get("/oneCityStores",function(req,res){
    const shops = [
        [104.062275,30.685623,  "爱心宠物店","成都通锦大厦一楼"],
        [104.079726,30.64296,  "蠢萌宠物店","四川省成都市武侯区林荫中街8号"],
        [104.119394,30.672233,  "玲珑宠物店","建设南路1号"],
        [104.077363,30.600042,  "卡哇伊宠物店","天顺路225号"]
    ];
    res.send(shops);
});

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