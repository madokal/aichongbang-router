var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//验证手机号是否已注册
router.get("/login", async function(req, res) {
  let tel = req.query.tel;
  let data = await client.get("/users", {
    tel
  });
  if (data.length > 0) {
    res.send({
      status: 0
    });
  } else {
    res.send({
      status: 1
    });
  }
});

//注册
router.post("/", async function(req, res) {
  let { tel,
    pwd,
    userName,
    email,
    trueName,
    role,
    storeStatus } = req.body;
    console.log(111)
  let data =  await client.post("/users", {
    tel,
    pwd,
    userName,
    email,
    trueName,
    role,
    storeStatus
  });
//   console.log(data);
  res.send(data);
});
module.exports = router;