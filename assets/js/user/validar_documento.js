document.addEventListener("DOMContentLoaded", () => {
    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(msgError);
        divErrores.append(space);
    };

    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.querySelector("#div-msg-error");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
    });

    const form = document.querySelector("form");

    const loadingDiv = document.querySelector("#loading");

    /* ---------------Formulario--------------- */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const url = "https://munisayan.gob.pe/tramite/api/user/solResPas";

        const formData = new FormData(form);
        const formObject = {};

        for (const [key, value] of formData) {
            formObject[key] = value;
        }

        //console.log(JSON.stringify(formObject));

        loadingDiv.showModal();

        console.log(JSON.stringify(formObject))

        await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            loadingDiv.close();

            divErrores.innerHTML = "";
            if (res.status === 200) {
                return res.json().then(respuesta => {
                    localStorage.setItem("email", respuesta.usuario.email);
                    localStorage.setItem("documento", respuesta.usuario.documento);
                    window.location.href = 'validarCodigo.html';
                });
            } else if (res.status === 404) {
                return res.json().then(respuesta => {
                    console.error(`Mensaje: ${respuesta.msg}`);
                    const msgerr = "• " + respuesta.msg;
                    createErrors(msgerr);
                    modal.showModal();
                });
            } else if (res.status === 400) {
                return res.json().then(respuesta => {
                    console.error(`Mensaje: ${respuesta.errors.msg}`);
                    const msgerr = "• " + respuesta.errors.msg;
                    createErrors(msgerr);
                    modal.showModal();
                });
            } else {
                // Otro código de estado
                console.log("Error en la petición. Estado: ", res.status);
            }
        }).catch(error => {
            loadingDiv.close();
            divErrores.innerHTML = "";
            createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
            modal.showModal();
            console.error(error);
        });
    });
})
