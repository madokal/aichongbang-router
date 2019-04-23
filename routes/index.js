var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/upload', function (req, res, next) {
  res.render('index', { title: 'Express' });
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
