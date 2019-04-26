var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//服务销售统计图路由

router.get("/serve", async function(req, res) {
  let data = await client.get("/orders", {"status":"完成交易",submitType: "findJoin", ref: ["service"] });
  let num = [];   //类型
  let qian =[];
  data.map((item)=>{
        num.push(item.service.name) ;     //push完成的订单类型 
  })
    num =[...new Set(num)];   //去重的类型
  
    num.map((item)=>{
        qian.push({name:item,value:0});
    })
    
  
    data.map((item)=>{
      qian.map((i,index)=>{
        if(item.service.name==i.name){
          i.value+=parseInt(data[index].service.price)
        }
      })
    })
    console.log(num,qian)
res.send({num,qian})
  
});






//获取全部数据

router.get("/", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let option = {};
  console.log(123123)
  if (type && value) {
    option = { [type]: value };
  }
  let data = await client.get("/users",{"role":"平台管理员",page, rows, ...option});
    res.send(data);
});


//增加一条平台管理员数据
router.post("/", async function(req, res) {
  let { tel, pwd,role } = req.body;
  let data = await client.post("/users", {
    tel,
    pwd,
    role
  });
  console.log(data);
  res.send(data);
});
//获取一条平台管理员数据
router.get("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/users/" + id);
  res.send(data);
});

//修改平台管理员
router.put("/:id", async function(req, res) {
  let { tel, pwd } = req.body;
  let id = req.params.id;
  let data = await client.put("/users/" + id, { tel, pwd });
  res.send(data);
});

//删除平台管理员
router.delete("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/users/" + id);
  res.send(data);
});

module.exports = router;
