var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//獲取session保存的數據
router.get('/getSession', function (req, res) {
    res.send(req.session.user || {});
});

//根据用户id查店铺
router.post("/:id", async function (req, res) {
    let id = req.body.id;
    let data = await client.get("/stores", { "users.$id": id, submitType: "findJoin", ref: "users" });
    res.send(data)
})

router.get("/", async function (req, res) {
    let { page, rows, type, value, status, deal, storeId } = req.query;
    let option = {};
    if (type && value) {
        option = { [type]: value }
    }
    let data1 = await client.get("/orders", { "stores.$id": storeId, "status": status, page, rows, submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    let data2 = await client.get("/orders", { "stores.$id": storeId, "deal": deal, page, rows, submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    if (status) {
        res.send(data1)
    } else if (deal) {
        res.send(data2)
    } else {
        res.send(data1)
    }

})
//根据类型获取所有订单
router.get("/deal", async function (req, res) {
    let { type, value, deal } = req.query;
    let option = {};
    if (type && value) {
        option = { [type]: value }
    }
    let data = await client.get("/orders", { "deal": deal, submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    res.send(data)
})
//根据状态查订单
router.get("/orders", async function (req, res) {
    let { type, value, allOrders } = req.query;
    let option = {};
    if (type && value) {
        option = { [type]: value }
    }
    let data = await client.get("/orders", { submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"], ...option });
    let orders = [];
    data.map((item) => {
        if (allOrders == item.status) {
            orders.push(item);
        }
    })
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
//修改
router.put("/:id", async function (req, res) {
    let id = req.body.id;
    let orderStatus = req.body.status;
    let data = await client.get("/orders/" + id);
    if (orderStatus.indexOf("交易") > -1) {
        data.status = "完成交易";
    } else {
        data.status = "服务已完成";
    }
    delete data._id;
    let data1 = await client.put("/orders/" + id, data);
    res.send(data1)
})
//用户确认修改状态
router.put("/user/:id", async function (req, res) {
    let id = req.body.id;
    let data = await client.get("/orders/" + id);
    data.userStatus = "ok";
    delete data._id;
    let data1 = await client.put("/orders/" + id, data);
    res.send(data)
})


//统计
router.get("/serves", async function (req, res) {
    let status = req.query.status;
    let data = await client.get("/orders");
    console.log(data)
    let array = [];
    data.map((item) => {
        if (status == item.status) {
            array.push(item);
        }
    });
    // console.log(array,"array")
    let date = '2019/4/5';
    let reg = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    // console.log(date.match(reg)[2])
    let axisData = ["春季", "夏季", "秋季", "冬季"];
    let seriesData = [{ name: "春季", value: 0 }, { name: "夏季", value: 0 }, { name: "秋季", value: 0 }, { name: "冬季", value: 0 }];
    array.forEach(function (item) {
        let date = parseInt((item.date).match(reg)[2]);

        console.log(typeof date, "item", date)

        if (date <= 3 & date >= 1) {
            seriesData[0].value++;
        }
        else if (date <= 6 & date >= 4) {
            seriesData[1].value++;
        }
        else if (date <= 9 & date >= 7) {
            seriesData[2].value++;
        } else {
            seriesData[3].value++;
        }
    });
    res.send({ axisData, seriesData });
})

module.exports = router;