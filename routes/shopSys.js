var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//统计
router.get("/cityQuarter", async function (req, res) {
    let status = "完成交易";
    let data = await client.get("/orders", { submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"] });
    let array = [];
    let cityArr = [];
    data.map((item) => {
        if (status == item.status) {
            array.push(item);
            cityArr.push(item.stores.city)
        }
    })
    cityArr = [...new Set(cityArr)];  //所有城市
    let reg = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    let axisData = cityArr;
    let seriesData = [];
    axisData.map((item) => {
        // seriesData.push({name:item,value:0})
        seriesData.push([item, 0, 0, 0, 0])
    })
    // console.log(seriesData,99)
    array.forEach(function (item) {
        let date = parseInt((item.date).match(reg)[2]);
        seriesData.map((i, index) => {
            if (item.stores.city == i[0]) {
                if (date <= 3 & date >= 1) {
                    i[1] += parseInt(item.totalPrice);
                }
                else if (date <= 6 & date >= 4) {
                    i[2] += parseInt(item.totalPrice);
                }
                else if (date <= 9 & date >= 7) {
                    i[3] += parseInt(item.totalPrice);
                } else {
                    i[4] += parseInt(item.totalPrice);
                }
            }
        })
    });
    res.send(seriesData)
})



//统计
router.get("/citySale", async function (req, res) {
    let status = req.query.status;
    // let status = "完成交易";
    let data = await client.get("/orders", { submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"] });
    // console.log(data[0],"完成交易")
    let date = '2019/5/5';
    let reg = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    let array = [];
    let cityArr = [];
    data.map((item) => {
        // console.log(item.status)
        if (status == item.status) {
            // console.log(item.stores.city,"city")
            array.push(item);
            cityArr.push(item.stores.city)
        }
    })
    // console.log(cityArr,10)
    cityArr = [...new Set(cityArr)];
    // console.log(cityArr,"cityArr");
    // console.log(date.match(reg)[2],"月份")

    let axisData = cityArr;
    let seriesData = [];
    axisData.map((item) => {
        seriesData.push({ name: item, value: 0 })
    })
    // console.log(seriesData,99)
    array.forEach(function (item) {
        // let date = parseInt((item.date).match(reg)[2]);
        // console.log(typeof date, "item", date)
        seriesData.map((i, index) => {
            // console.log(i, index, "i,cs")
            if (item.stores.city == i.name) {
                i.value += parseInt(item.totalPrice);
            }
        })
        // if (date <= 3 & date >= 1) {
        //     seriesData[0].value++;
        // }
        // else if (date <= 6 & date >= 4) {
        //     seriesData[1].value++;
        // }
        // else if (date <= 9 & date >= 7) {
        //     seriesData[2].value++;
        // } else {
        //     seriesData[3].value++;
        // }
    });
    // console.log(axisData,seriesData,"oooo")
    res.send({ axisData, seriesData });
})


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
//查询已关闭门店
router.get("/closeshops", async function (req, res) {
    let option = {};
    let data = await client.get("/stores");
    let newData = [];
    if (data.length > 0) {
        for (let i of data) {
            if (i.storeStatus == 2) {
                newData.push(i);
            }
        }
    }
    // console.log(data);
    res.send(newData);
})
//查询所有门店
router.get("/", async function (req, res) {
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
    // console.log("111")
    let {
       storeStatus
    } = req.body;
    let id = req.params.id;
    // console.log("storeStatus", storeStatus)
    let data = await client.put("/stores/" + id, {
        storeStatus
    });
    res.send(data);
});


module.exports = router;