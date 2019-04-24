var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//订单管理
router.post("/", async function (req, res) {
    res.send("wh")
});
//根据类型查订单
router.get("/", async function (req, res) {
    let { page, rows, type, value, allOrders } = req.query;
    console.log(req.query)
    let option = {};
    if (type && value) {
        option = { [type]: value }
    }
    let data = await client.get("/orders", { page, rows, submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    let orders = [];
    // console.log(data, 'data')
    data.rows.map((item) => {
        if (allOrders=="订单") {
            if (item.status == "完成交易" || item.status == "等待交易") {
                orders.push(item)
            }
        } else {
            if (item.status == "服务已完成" || item.status == "服务等待中") {
                orders.push(item)
            }
        }
    })
    res.send(orders)
})
//根据状态查订单
router.get("/orders", async function (req, res) {
    let { page, rows, type, value, allOrders } = req.query;
    console.log(req.query)
    let option = {};
    if (type && value) {
        option = { [type]: value }
    }
    let data = await client.get("/orders", { page, rows, submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    let orders = [];
    console.log(allOrders, 'data')
    data.rows.map((item) => {
        if (allOrders == item.status) {
            orders.push(item);
        }
    })
    // console.log(orders, 'orders')
    res.send(orders)
})
//增加
router.post("/", async function (req, res) {
    let { order } = req.body;
    let data = await client.post("/orders", { order });
    res.send(data)
})
//删除
router.delete("/:id", async function (req, res) {
    let id = req.body.id;
    let data = await client.delete("/orders/" + id);
    res.send(data)
})

module.exports = router;