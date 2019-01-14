jQuery(function ($) {

    let insert = (userName, name, lastName, email) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/insertUser", { userName, name, lastName, email }, (data) => {
                resolve(data);
            })
        })
    }
    //增加用户
    var $primaryBtn = $(".btn-primary");
    $primaryBtn.click(async () => {
        var userName = $(".userName").val();
        var name = $(".name").val();
        var lastName = $(".lastName").val();
        var email = $(".email").val();
        let data = await insert(userName, name, lastName, email);
        if (data) {
            location.href = "../html/display.html";
        }

    })






    // ===========================结束============================
})