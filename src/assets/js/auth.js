document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form-group")


    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const login = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (user.login === login && user.password === password) {
            const token = 32323; //Math.random().toString(36).substr(2)
            localStorage.setItem("authToken", token);
            window.location.href = "file:///c%3A/Users/User/Desktop/TODO/todo-skeleton/index.html";
            return;
        } 
        else {
            alert("неверно указанные данные");
        }
    });
});