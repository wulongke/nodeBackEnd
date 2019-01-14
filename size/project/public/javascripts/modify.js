jQuery(($) => {
    //1、先行搜索，渲染出来之后，根据渲染内容修改
    let findSearch = (userName) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/searchVal", { userName }, (data) => {
                resolve(data)
            })
        })
    }

    $(".search_btn").click(async () => {
        var userName = $(".search_val").val();
        let data = await findSearch(userName);
        if (data) {
            let html = data.map((item, index) => {
                return `<tr>
                  <td>${item._id}</td>
                  <td>${item.name}</td>
                  <td>${item.lastName}</td>
                  <td class="userName">${item.userName}</td>
                      </tr>`
            }).join("");
            $(".list").html(html);
        }
    });

    //2、根据渲染的内容修改
    let update = (userName, modifyName, modifyLastName,modifyuserName) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/updateUser", { userName, modifyName, modifyLastName,modifyuserName}, (data) => {
                resolve(data)
            })
        })
    }

    //3.修改后渲染
    let find = (modifyuserName) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/modifyUser", { modifyuserName }, (res) => {
                resolve(res)
            })
        })
    }
    //4.点击修改获取值
    $(".modify_btn").click(async () => {
        var userName = $(".search_val").val();
        var modifyName = $(".modify_name").val();
        var modifyLastName = $(".modify_lastName").val();
        var modifyuserName = $(".modify_userName").val();
        
        let data = await update(userName, modifyName, modifyLastName,modifyuserName);
        let res = await find(modifyuserName);
        if (res) {
            let html = res.map((item, index) => {
                return `<tr>
                  <td>${item._id}</td>
                  <td>${item.name}</td>
                  <td>${item.lastName}</td>
                  <td class="userName">${item.userName}</td>
                      </tr>`
            }).join("");
            $(".list").html(html);
        }

    })
















    // ===================================
})