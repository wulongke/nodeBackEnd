
$(() => {
  //用面向对象方法，方便维护
  (async () => {
    //(fn)面向对象函数
    let fn = {
      //进入页面就先行判断有没有令牌，为(true)就渲染
      true: async () => {
        let data = await fn.show();//执行渲染函数的(ajax)函数
        //进入页面马上渲染代码
        let html = data.map((item, index) => {
          return `<tr>
          <td>${item._id}</td>
          <td>${item.name}</td>
          <td>${item.lastName}</td>
          <td class="userName">${item.userName}</td>
          <td>
            <a href="../html/Modify.html"><i class="fa fa-pencil"></i></a>
            <a href="#myModal" role="button" data-toggle="modal" class="delBtn"><i class="fa fa-trash-o"></i></a>
          </td>
                </tr>`
        }).join("");
        $(".list").html(html);

        // ====================删除的(ajax)请求==========================
        let del = (userName) => {
          return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/delUser", { userName }, (data) => {
              console.log(data);
              resolve(data)
            })
          })
        };
        //=======================点击删除后再重新渲染================================
        $(".delBtn").on("click", async function () {
          var userName = $(this).parent().prev(".userName").html();
          let data = await del(userName);
          $.post("http://localhost:3005/users/findUser", (data) => {
            let html = data.map((item, index) => {
              return `<tr>
                  <td>${item._id}</td>
                  <td>${item.name}</td>
                  <td>${item.lastName}</td>
                  <td class="userName">${item.userName}</td>
                  <td>
                    <a href="../html/Modify.html"><i class="fa fa-pencil"></i></a>
                    <a href="#myModal" role="button" data-toggle="modal" class="delBtn"><i class="fa fa-trash-o"></i></a>
                  </td>
                      </tr>`
            }).join("");

            $(".list").html(html);
          })
        })
      },
      // 进入页面就先行判断有没有令牌，为(false)自动跳转到登入页
      false() {
        location.href = "../index.html";
        return this;
      },
      //渲染的(ajax)请求
      show() {
        return new Promise((resolve, reject) => {
          $.ajax({
            type: "POST",
            headers: {
              token: localStorage.getItem("token")
            },
            url: "http://localhost:3005/users/findUser",
            success(data) {
              resolve(data)
            }
          })
        })
      },
      //自动登录，存储令牌(ajax)请求
      autoLogin() {
        return new Promise((resolve, reject) => {
          $.ajax({
            type: "POST",
            headers: {
              token: localStorage.getItem("token")
            },
            url: "http://localhost:3005/users/autoLogin",
            success(data) {
              resolve(data)
            }
          })
        })
      },
      // insertIg(){
      //   console.log($("#img")[0].src)
      //  },
      //上传头像(ajax)请求
      Upload() {
        var fileNode = document.getElementById("file");
        fileNode.onchange = function () {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              let data = JSON.parse(xmlhttp.responseText);
              document.getElementById("img").src = "http://localhost:3005/" + data.file.filename;
              var obj = localStorage.getItem("token")//获取(token)值
              // 1、根据获取的(token)值，传送到后端，进行解密
              // 2、获取到图片名字，传送到数据库
              //更改图片的ajax请求
              $.post("http://localhost:3005/users/updateImg", { "img": data.file.filename, "obj": obj }, (res) => {
        
              })
            }
          };
          var data = new FormData();
          data.append("logo", fileNode.files[0])
          xmlhttp.open("post", "http://localhost:3005/users/upload", true);
          xmlhttp.send(data);
          fileNode.value = null;
          // =========================================
        }
      },
      //渲染头像
      showImg() {
        let token = localStorage.getItem("token")//获取(token)值
        $.post("http://localhost:3005/users/searchImg", { "tokenName": token }, (data) => {
          console.log(data)
          let show = data.map((item, index) => {
            return `<img src="http://localhost:3005/${item.images}" id="img" alt="上传图片" style="width: 100%;height: 100%;">`
          }).join("");
          $(".showImg").html(show)
        })
      }
      // ===========================
    }
    let isLogin = await fn.autoLogin();
    // 异步 awiat和async
    fn[isLogin.status]();
    // ========================
    fn.Upload()//执行上传图片
    fn.showImg()
  })();

  //获取图片的路径，增加到数据库，然后渲染

  // =============================================================
})