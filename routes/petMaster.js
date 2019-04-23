// import { read } from 'fs';

var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//宠物主管理

router.get("/", async function(req, res) {
    console.log("进来了");
    let {page,rows,type,value} = req.query;
    console.log(page)
    let option  = {};
    if(type && value){
         option = {[type]:value}
    }
    console.log(option);
    let data = await client.get("/petOwners",{page,rows,submitType:"findJoin",ref:["vip","level"],...option});
    console.log(data.rows); 
    res.send(data);
});
router.put("/:id",async function(req,res){
    let {blacklist} = req.body;
    let id = req.params.id;
    console.log(id);
    let data = await client.put("/petOwners/"+id,{blacklist});
    res.send(data);
})
module.exports = router;