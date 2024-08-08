
const tok = localStorage.getItem("Tok");

if (tok) {
    if (tok === "true") {
        console.log("Sesion aprobada");
    } else if (tok === "false") {
        window.location.href = "login.html";
    }
}