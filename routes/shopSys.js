var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("localhost:8080");

//查询所有门店
router.get("/", async function(req, res) {
    let {
        page,
        rows,
        type,
        value
    } = req.query;  
    let option = {};
    if (type && value) {
        option = {
            [type]: value
        }
    }
    let data = await client.get("/stores", {
        page,
        rows,
        ...option
    });
    // console.log(data);
    res.send(data);
})

//根据ID查询门店
router.get("/:id", async function(req, res) {
    let id = req.params.id;
    let data = await client.get("/stores/" + id);
    res.send(data);
});



//修改门店
router.put("/:id", async function(req, res) {
    let {
        name,
        addr,
        tel,
        url,
    } = req.body;
    let screen = [];
    let infos = JSON.parse(req.body.screen);
    for (let i in infos) {
        infos[i].seat = JSON.parse(infos[i].seat);
        screen.push({
            name: infos[i].name,
            seat: infos[i].seat
        })
    }
    let id = req.params.id;
    let data = await client.put("/stores/" + id, {
        name,
        addr,
        tel,
        url,
        screen
    });
    res.send(data);
});

// //删除院线
// router.delete("/:id", async function(req, res) {
//     let id = req.params.id;
//     let data1 = await client.get("/filmAndCinemas", { submitType: "findJoin", ref: ["cinemas", "films"] });
//     for (let i = 0; i < data1.length; i++) {
//         if (data1[i].cinemas._id == id) {
//             await client.delete("/filmAndCinemas/" + data1[i]._id);
//         }
//     }
//     let data = await client.delete('/cinemas/' + id);
//     res.send(data);
// });

module.exports = router;