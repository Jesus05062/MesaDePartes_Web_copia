document.addEventListener("DOMContentLoaded", () => {

    /* ---------------Funcionalidad del modal Loading--------------- */
    const modalLoading = document.querySelector("#loading");
    modalLoading.showModal();

    const modalErrorFatal = document.querySelector("#modal-error-fatal");
    const divErrorFatal = document.getElementById("div-msg-error-fatal");

    const createErrorFatal = () => {

        activeCount.style.display = "none";
        const p1 = document.createElement("p");
        const msgFisrt = "• El servidor está temporalmente ocupado, ¡inténtalo de nuevo más tarde!";
        p1.append(msgFisrt);

        const p2 = document.createElement("p");
        const msgSecond = "• Intente cargar la pagina nuevamente desde su correo";
        p2.append(msgSecond);

        divErrorFatal.append(p1);
        divErrorFatal.append(p2);
    }

    const inputNacimiento = document.getElementById("id_nacimiento");
    const inputContainer = document.getElementById('id_direccion');

    const form = document.querySelector("form");

    const activeCount = document.getElementById("activar_cuenta");
    const successMsg = document.getElementById("successMsg")
    const userName = document.querySelector("#user-name");

    const urlParams = new URLSearchParams(window.location.search);
    let tokEncoded = urlParams.get('Tok');

    // Reemplazar los espacios en blanco con "+"
    tokEncoded = tokEncoded.replace(/\s/g, '+');

    const tok = decodeURIComponent(tokEncoded);

    const url = "http://munisayan.gob.pe/tramite/api/user/activo/act";

    const bodyData = {
        id: tok
    };

    fetch(url, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.status === 200) {
            return res.json().then(response => {
                console.log(response);
                if (!response.Nombres) {

                    inputNacimiento.style.display = "none";
                    inputNacimiento.removeAttribute("required");

                    inputContainer.classList.remove('col-md-6');
                    inputContainer.classList.add('col-md-12');
                }
                if (!response.activado) {
                    userName.textContent = `${response.Nombres} ${response.ApellidoPaterno} ${response.ApellidoMaterno} ${response.razonsocial}`;
                } else {
                    activeCount.style.display = "none";
                    successMsg.style.display = "block";
                }
                modalLoading.close();
            });
        } else {
            console.error("Error de la petición", res.status);
        }
    }).catch(error => {
        modalLoading.close();
        createErrorFatal();
        modalErrorFatal.showModal();

    });


    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.getElementById("div-msg-error");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
    });

    /* --------------------Formulario----------------------- */
    const urlact = `http://munisayan.gob.pe/tramite/api/user/activacion`;

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(e);
        divErrores.append(space);
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const formObject = {
            id: tok,
        };

        for (const [key, value] of formData) {
            if (key === 'departamento' || key === 'provincia' || key === 'distrito') {
                const select = document.querySelector(`#id_${key}`);
                const selted = select.options[select.selectedIndex].text;
                
                formObject[key] = selted;
            } else {
                formObject[key] = value;
            }

        }

        modalLoading.showModal();

        console.log(JSON.stringify(formObject));

        await fetch(urlact, {
            method: "PUT",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {

            divErrores.innerHTML = "";
            modalLoading.close();

            if (formObject.Password !== formObject.repetirpassword) {
                const msgerr = "• Las contraseñas no coinciden";
                createErrors(msgerr);
                modal.showModal();
                return;
            }

            if (res.status === 200) {
                return res.json().then(erponse => {
                    activeCount.style.display = "none";
                    successMsg.style.display = "block";
                });
            } else if (res.status === 400) {
                return res.json().then(response => {
                    console.log(JSON.stringify(response));
                    response.errors.forEach(error => {
                        console.error(`Mensaje: ${error.msg}`);
                        const msgerr = "• " + error.msg;
                        createErrors(msgerr);
                        modal.showModal();
                    })
                });
            } else if (res.status === 500) {
                console.error(`Mensaje: ${response.msg}`);
                const msgerr = "• " + response.msg;
                createErrors(msgerr);
                modal.showModal();
            } else {
                console.log("Error en la petición", res.status);
            }
        }).catch((error) => {
            modalLoading.close();
            divErrores.innerHTML = "";
            createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
            modal.showModal();
            console.error(error);
        });

    });

});