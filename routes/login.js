var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//平台管理员登录
router.post("/deng", async function(req, res) {
    let { tel, pwd } = req.body;
    let data = await client.get("/users", {tel, pwd,findType:"exact"});
    console.log(data)
    if(data[0].role=='平台管理员'){
      req.session.user = data[0];
      res.send({
        status: 1
      });
    }else{
      res.send({
        status: 0
      });
    }
  });

  //店铺管理员登录
    router.post("/dengs", async function(req, res) {
        let { tel, pwd } = req.body;
        let data = await client.get("/users", {tel, pwd,findType:"exact"});
        console.log(data[0]._id,data[0].userName)
        if(data[0].role=='店铺管理员'){
        req.session.user = data[0];
            if(data[0].storeStatus=='未开店'){
                res.send({
                    status: 1,
                    id:data[0]._id
                });
            }else if(data[0].storeStatus=='已开店'){
                res.send({
                    status: 2,
                    id:data[0]._id
                });
            }else if(data[0].storeStatus=='待审核'){
                res.send({
                    status: 3,
                    id:data[0]._id
                });
            }else if(data[0].storeStatus=='已封店'){
                res.send({
                    status: 4,
                    id:data[0]._id
                });
            }
        }else{
        res.send({
            status: 0
        });
        }
    });
  

  //获取session
  router.get("/getSession", function(req, res) {
    let data = req.session.user;
    res.send(data || {});
  });
  //移除session
  router.get("/removeSession", function(req, res) {
    req.session.user = null;
    res.send({ status: 1 });
  });
module.exports = router;