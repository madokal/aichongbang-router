var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

<<<<<<< HEAD
//获取全部数据
router.get("/", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let option = {};
  if (type && value) {
    option = { [type]: value };
  }
  let data = await client.get("/users", { page, rows, ...option });
  res.send(data);
});

//增加一条平台管理员数据
router.post("/", async function(req, res) {
  let { tel, pwd, name } = req.body;
  let data = await client.post("/users", {
    tel,
    pwd,
    name
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
  let { name, tel, pwd } = req.body;
  let id = req.params.id;
  let data = await client.put("/users/" + id, { name, tel, pwd });
  res.send(data);
});

//删除平台管理员
router.delete("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/users/" + id);
  res.send(data);
});

=======
//获取全部店铺管理员数据
router.get("/", async function(req, res) {
  let { page, rows, type, value } = req.query;
  let option = {};
  console.log(123123)
  if (type && value) {
    option = { [type]: value };
  }
  let data = await client.get("/users",{"role":"店铺管理员",page, rows, ...option});
    res.send(data);
});

//获取一条店铺管理员数据
router.get("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.get("/users/" + id);
  res.send(data);
});

//删除店铺管理员
router.delete("/:id", async function(req, res) {
  let id = req.params.id;
  let data = await client.delete("/users/" + id);
  res.send(data);
});

>>>>>>> tang
module.exports = router;
