var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");
const multiparty = require("multiparty");
const path = require("path");


router.get("/", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let searchObj = {};
  if (type) {
    searchObj = { [type]: value };
  }
  let data = await client.get("/commodities", { page, rows, ...searchObj });
  res.send(data);
});
 
//统计各个店铺的销售
router.get("/sell", async function(req, res) {
  let status = req.query.sell;
  let data = await client.get("/orders", {"status":"完成交易",
    submitType: "findJoin",
    ref: ["petOwners", "commodities", "stores", "service"]
  });
  // console.log(data);
  let array = [];
  data.map(item => {
    if (status == item.status) {
      array.push(item);
    }
  });
  let date = "2019/4/5";
  let reg = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
  let axisData = ["春季", "夏季", "秋季", "冬季"];
  let seriesData = [
    { name: "春季", value: 0 },
    { name: "夏季", value: 0 },
    { name: "秋季", value: 0 },
    { name: "冬季", value: 0 }
  ];
  array.forEach(function(item) {
    let date = parseInt(item.date.match(reg)[2]);
    if ((date <= 3) & (date >= 1)) {
      seriesData[0].value += parseInt(item.counts);
    } else if ((date <= 6) & (date >= 4)) {
      seriesData[1].value += parseInt(item.counts);
    } else if ((date <= 9) & (date >= 7)) {
      seriesData[2].value += parseInt(item.counts);
    } else {
      seriesData[3].value += parseInt(item.counts);
    }
  });
  res.send({ axisData, seriesData });
});



//商品管理

router.get("/shop", async function(req, res) {
  let id = req.query.id;
  
  let data = await client.get("/stores", {
    "users.$id": id,
    submitType: "findJoin",
    ref: "users"
  });
  res.send(data);
});



router.get("/:id", async function(req, res) {
  let shopId=req.params.id
  // console.log(shopId)
  let { page, rows, type, value } = req.query;
  let searchObj = {};
  if (type) {
    searchObj = { [type]: value };
  }
  let data = await client.get("/commodities", {"stores.$id":shopId,submitType:"findJoin",ref:"stores", page, rows, ...searchObj });
  res.send(data);
});




router.get("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/commodities/" + id);
  res.send(data);
});






router.post("/", async function(req, res) {
  
  let {
    name,
    commodityType,
    textureOrMade,
    size,
    exclusiveSize,
    weight,
    taste,
    specialFunc,
    palce,
    madeDate,
    shelfLife,
    supplier,
    info,
    price,
    pictures,
    id
  } = req.body;
  
  let data = await client.post("/commodities", {
    name,
    commodityType,
    textureOrMade,
    size,
    exclusiveSize,
    weight,
    taste,
    specialFunc,
    palce,
    madeDate,
    shelfLife,
    supplier,
    info,
    price,
    pictures,
    stores: { $ref: "stores", $id: id }
  });
  res.send(data);
});



router.put("/:id", async function(req, res) {
  let id = req.params.id;
  let {
    name,
    commodityType,
    textureOrMade,
    size,
    exclusiveSize,
    weight,
    taste,
    specialFunc,
    palce,
    madeDate,
    shelfLife,
    supplier,
    info,
    price,
    pictures
  } = req.body;
  await client.put("/commodities/" + id, {
    name,
    commodityType,
    textureOrMade,
    size,
    exclusiveSize,
    weight,
    taste,
    specialFunc,
    palce,
    madeDate,
    shelfLife,
    supplier,
    info,
    price,
    pictures
  });
  res.send({ status: 1 });
});

router.delete("/:id", async function(req, res) {
  let id = req.params.id;
  await client.delete("/commodities/" + id);
  res.send({ status: 1 });
});


router.post("/upload", function(req, res) {
  let form = new multiparty.Form({
    uploadDir: "./public/upload" // 指定保存上传文件的路径
  });
  form.parse(req, function(err, fields, files) {
    let key = Object.keys(files)[0]; // 获取上传信息中的key
    if (err) {
      res.send(err);
    } else {
      res.send(path.basename(files[key][0].path)); // 根据key获取上传的文件名并返回
    }
  });
});

module.exports = router;
