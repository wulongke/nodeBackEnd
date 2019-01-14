$(() => {

    let findSearch = (userName) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/searchVal", { userName }, (data) => {
                resolve(data)
              })
        })
    }

    $(".search_btn").click(async()=>{
        var userName = $(".search_val").val();
            let data = await findSearch(userName);
        if(data){
            let html = data.map((item, index) => {
                return `<tr>
                  <td>1</td>
                  <td>${item.name}</td>
                  <td>${item.lastName}</td>
                  <td class="userName">${item.userName}</td>
                      </tr>`
              }).join("");
              $(".list").html(html); 
        }
    });

    // ===============================================
})