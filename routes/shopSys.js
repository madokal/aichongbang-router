var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//查询已审核门店
router.get("/shopsed", async function (req, res) {
    let data = await client.get("/stores");
    let newData = [];
    if (data.length > 0) {
        for (let i of data) {
            if (i.storeStatus == 1) {
                newData.push(i);
            }
        }
    }
    // console.log(data);
    res.send(newData);
})
//查询未审核门店
router.get("/noshops", async function (req, res) {
    let option = {};
    let data = await client.get("/stores");
    let newData = [];
    if (data.length > 0) {
        for (let i of data) {
            if (i.storeStatus == 0) {
                newData.push(i);
            }
        }
    }
    // console.log(data);
    res.send(newData);
})

//查询所有门店
router.get("/", async function(req, res) {
    let { page, rows, type, value } = req.query;
    let option = {};
    if (type && value) {
        option = {
            [type]: value
        }
    }
    let data = await client.get("/stores", { page, rows, ...option });
    res.send(data);
});

//根据ID查询门店
router.get("/:id", async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/stores/" + id);
    res.send(data);
});

//修改门店  佣金比例和VIP等级
router.put("/:id", async function (req, res) {
    let {
        VIPlevel, commission
    } = req.body;
    let id = req.params.id;
    let data = await client.put("/stores/" + id, {
        VIPlevel, commission
    });
    res.send(data);
});

//审核门店  状态
router.put("/auditshop/:id", async function (req, res) {
    console.log("111")
    let {
       storeStatus
    } = req.body;
    let id = req.params.id;
    console.log("storeStatus", storeStatus)
    let data = await client.put("/stores/" + id, {
        storeStatus
    });
    res.send(data);
});

// //删除院线
// router.delete("/:id", async function(req, res) {
//     let id = req.params.id;
//     let data1 = await client.get("/filmAndCinemas", { submitType: "findJoin", ref: ["cinemas", "films"] });
//     for (let i = 0; i < data1.length; i++) {
//         if (data1[i].cinemas._id == id) {
//             await client.delete("/filmAndCinemas/" + data1[i]._id);
//         }
//     }
//     let data = await client.delete('/cinemas/' + id);
//     res.send(data);
// });

module.exports = router;