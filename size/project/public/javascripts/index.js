jQuery(() => {

    let login = (username, password) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3005/users/login", { username, password }, (data) => {
                resolve(data)
                console.log(data)
            })
        })
    }

    let loginBtn = $(".login_btn");
    loginBtn.click(async () => {
        let username = $("#username").val();
        let password = $("#password").val();
        let data = await login(username, password);
        let fn = {
            success() {
                console.log('登录成功');
                localStorage.setItem("token", data.token)
                location.href = "./html/display.html"
            },
            fail() {
                console.log('登录失败');
            },
            other() {

            }
        }
        fn[data.status]()

    })





    // =======================================
})