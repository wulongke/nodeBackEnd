var express = require('express');
var router = express.Router();
var multer = require("multer");
var {
    connect,
    insert,
    find,
    del,
    update,
    ObjectId
} = require("../public/lib/mongod.js");
var token = require("../public/lib/token.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//增加用户
router.post('/insertUser', async (req, res, next) => {
    let {
        userName,
        name,
        lastName,
        email
    } = req.body
    let data = await insert("consumer", [{
        userName: userName,
        name: name,
        lastName: lastName,
        email: email
    }])
    
    if (data) {
        res.send(data)
    }

});

//首页查询用户，渲染
router.post('/findUser', async (req, res, next) => {
    let {
        name
    } = req.body
    let data = await find(`consumer`, name ? {
        name
    } : {})
    res.send(data);
    // if (data) {
    //     res.send("成功")
    // }
});

//搜索页查询用户，渲染
router.post('/searchVal', async (req, res, next) => {
    let {
        userName
    } = req.body
    let data = await find(`consumer`, {
        userName
    })
    res.send(data);
});

//修改后渲染，渲染
router.post('/modifyUser', async (req, res, next) => {
    let {
        modifyuserName
    } = req.body
    let arr = await find(`consumer`, {
        userName:modifyuserName
    })
    res.send(arr);
});


//删除用户
router.post('/delUser', async (req, res, next) => {
    let {
        userName,
        name,
        lastName,
        email
    } = req.body
    let data = await del(`consumer`,{userName})
    res.send(data);
})

//修改用户
router.post('/updateUser', async (req, res, next) => {
    let {
        userName,
        modifyName,
        modifyLastName,
        modifyuserName
    } = req.body
    let data = await update(`consumer`,{ 
        userName:userName
      },{
        name:modifyName,
        lastName:modifyLastName,
        userName:modifyuserName
        })
    res.send(data);
})
//设置上传文件
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      //给图片加上时间戳格式防止重名名
      //比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
      cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
  });
  var upload = multer({
    storage: storage
  });
  
  router.post('/upload', upload.single('logo'), function (req, res, next) {
    // console.log(req)
    res.json({
      status: "success",
      file: req.file
    });
  });
  //把获取到的图片路径，更改数据库
    router.post('/updateImg', async (req, res, next) => {
    let {
        img,
        obj
    } = req.body
    let obj1 = await token.decodeToken(obj);
    let username = obj1.payload.data.username;
    let data = await update(`login`,{ 
        username:username
      },{
        images:img
        })
    res.send(data);
    })
    //搜索页查询登录用户，获取图片渲染
    router.post('/searchImg', async (req, res, next) => {
    let {
        tokenName
    } = req.body
    let tokenUsername = await token.decodeToken(tokenName);
    let username = tokenUsername.payload.data.username;
    let data = await find(`login`, {
        username
    })
    res.send(data);
});
//登入注册配合令牌
router.post('/login', async (req, res, next) => {
    // console.log(req.body);
    let {
        username,
        password
    } = req.body
    let data = await find(`login`, {
        username: username
    })
    // console.log(data)
    if (data[0].password === password) {
      res.send({
        status: "success",
        token: token.createToken({
            password, 
            username
        }, 3600)
      });
    } else {
      res.send({
        status: "fail"
      });
    }
  });

  //自动登入
  router.post('/autoLogin', async (req, res, next) => {
    // console.log(req.headers)
    res.send({
      status: token.checkToken(req.headers.token)
    })
  })
  
module.exports = router;