var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

const multiparty = require("multiparty");
const path = require("path")

//门店申请
//新增门店
router.post("/", async function (req, res) {
    let { name,
        permitNum,
        permitAddr,
        tel,
        legalPerson,
        special,
        storeStatus,
        workers,
        VIPlevel,
        commission,
        cPermitImageUrl,
        cLogoImageUrl,
     } = req.body;
    let data = await client.post("/stores", {
        name,
        permitNum,
        permitAddr,
        tel,
        legalPerson,
        special,
        storeStatus,
        workers,
        VIPlevel,
        commission,
        cPermitImageUrl,
        cLogoImageUrl,
    });
    res.send(data);
});
//上传文件
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