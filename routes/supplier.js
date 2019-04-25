var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//查询所有
router.get("/", async function (req, res) {
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

//统计
router.get("/orders", async function (req, res) {
    // let status = req.query.status;
    let status = "服务已完成";
    let data = await client.get("/orders", {submitType: "findJoin", ref: ["petOwners", "commodities", "stores", "service"] });
    console.log(data[0],"服务已完成")
    let date = '2019/5/5';
    let reg = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    let array = [];
    let cityArr = [];
    data.map((item)=>{
    console.log(item.status)
    if(status==item.status){
    console.log(item.stores.city,"city")
    array.push(item);
    cityArr.push(item.stores.city)
    }
    })
    // console.log(cityArr,10)
    cityArr =[...new Set(cityArr)];
    console.log(cityArr,"cityArr");
    // console.log(date.match(reg)[2],"月份")
    // let stores = await client.get("/stores", { "storeStatus":"1"});
    // console.log("店铺",stores)
    let axisData = cityArr;
    let seriesData = [];
    axisData.map((item)=>{
    seriesData.push({name:item,value:0})
    })
    console.log(seriesData,99)
    array.forEach(function (item) {
    // let date = parseInt((item.date).match(reg)[2]);
    // console.log(typeof date, "item", date)
    seriesData.map((i,index)=>{
    console.log(i,index,"i,cs")
    if(item.stores.city==i.name){
    i.value+=parseInt(item.totalPrice);
    }
    })
    // if (date <= 3 & date >= 1) {
    // seriesData[0].value++;
    // }
    // else if (date <= 6 & date >= 4) {
    // seriesData[1].value++;
    // }
    // else if (date <= 9 & date >= 7) {
    // seriesData[2].value++;
    // } else {
    // seriesData[3].value++;
    // }
    });
    // console.log(axisData,seriesData,"oooo")
    res.send({ axisData, seriesData });
    })
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
        img,
        product,
        time,
        price,
        produce
    } = req.body;
    let data = await client.post("/providers", {
        name,
        addr,
        img,
        tel,
        brand,
        product,
        time,
        price,
        produce
    });
    res.send(data);
});
//营业执照
// router.post("/upload",function(req,res){
//     let form=new multiparty.Form({
//         uploadDir:'./public/upload'
//     });
//     form.parse(req,function(err,fields,files){
//         let key=Object.keys(files)[0];//获取上传信息的key
//         if(err){
//             res.send(err);
//         }else{
//             res.send(path.basename(files[key][0].path))
//         }
//     })
// });

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