document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const loadingDiv = document.querySelector("#loading");
    const divErrores = document.getElementById("div-msg-error");
    const registro = document.querySelector("#registro");
    const successMsg = document.querySelector("#successMsg");
    const userEmail = document.querySelector("#user-email");

    const createError = (mensage) => {
        const msgError = document.createElement("span");
        msgError.textContent = mensage;
        divErrores.append(msgError);
    }

    /* ---------------Funcionalidad del modal--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
        //divErrores.removeChild(divErrores.lastElementChild);
    });

    /* --------------------Formulario----------------------- */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const formObject = {};

        for (const [key, value] of formData) {
            formObject[key] = key === 'documento' ? +value : value;
        }

        const url = "https://munisayan.gob.pe/tramite/api/user";

        loadingDiv.showModal();
        //console.log(JSON.stringify(formObject));

        await fetch(url, {
            method: "POST",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {

            divErrores.innerHTML = "";
            loadingDiv.close();

            if (res.status === 200) {
                return res.json().then(respuesta => {

                    userEmail.textContent = formObject.email;

                    registro.style.display = "none";
                    successMsg.style.display = "block";
                });
            } else if (res.status === 400) {
                return res.json().then(respuesta => {
                    if (respuesta.errors) {
                        const msgerr = "• " + respuesta.errors[0].msg;
                        createError(msgerr);
                        modal.showModal();
                        return;
                    } else if (respuesta.msg) {
                        const msgerr = "• " + respuesta.msg;
                        createError(msgerr);
                        //console.log("Datos incorrectos:", data.msg);
                        modal.showModal();
                        return;
                    }
                });
            } else {
                console.log("Error en la petición", res.status);
            }
        }).catch(error => {
            loadingDiv.close();
            divErrores.innerHTML = "";
            createError(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
            modal.showModal();
            console.error(error);
        });
    });
})
