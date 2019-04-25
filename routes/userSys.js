var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

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

module.exports = router;
