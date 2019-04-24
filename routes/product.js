var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");
const multiparty =require("multiparty");
const path =require("path")

//商品管理
router.get("/",async function(req,res){
    let {page,rows,type,value} = req.query;
    let searchObj = {};
    if(type){
        searchObj = {[type]:value};
    }
    let data = await client.get("/commodities",{page,rows,...searchObj});
    res.send(data);
});

router.get("/:id",async function(req,res){
    let id = req.params.id;
    let data = await client.get("/commodities/"+id);
    res.send(data);
});

router.post("/",async function(req,res){
    let {name,commodityType,textureOrMade,size,exclusiveSize,weight,taste,specialFunc,palce,madeDate,shelfLife,supplier,info,price,pictures} = req.body;
   let data= await client.post("/commodities",{name,commodityType,textureOrMade,size,exclusiveSize,weight,taste,specialFunc,palce,madeDate,shelfLife,supplier,info,price,pictures});
    res.send(data);
});

router.put("/:id",async function(req,res){
    let id = req.params.id;
    let {name,commodityType,textureOrMade,size,exclusiveSize,weight,taste,specialFunc,palce,madeDate,shelfLife,supplier,info,price,pictures} = req.body;
    await client.put("/commodities/"+id,{name,commodityType,textureOrMade,size,exclusiveSize,weight,taste,specialFunc,palce,madeDate,shelfLife,supplier,info,price,pictures});
    res.send({status:1});
});
router.delete("/:id",async function(req,res){
    let id = req.params.id;
    await client.delete("/commodities/"+id);
    res.send({status:1});
});

router.post("/upload", function (req, res) {
    let form = new multiparty.Form({
        uploadDir: "./public/upload" // 指定保存上传文件的路径
    });
    form.parse(req, function (err, fields, files) {
        let key = Object.keys(files)[0]; // 获取上传信息中的key
        if (err) {
            res.send(err);
        } else {
            res.send(path.basename(files[key][0].path)); // 根据key获取上传的文件名并返回
        }
    });
  });

module.exports = router;