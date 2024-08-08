document.addEventListener("DOMContentLoaded", () => {
    let shouldWarnBeforeUnload = true; // Bandera para controlar la alerta de beforeunload

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
        divErrores.innerHTML = "";
    });

    const form = document.querySelector("form");

    const loadingDiv = document.querySelector("#loading");

    /* ---------------Temporizador--------------- */
    const timerElement = document.getElementById("timer");
    let timeRemaining = 5 * 60; // 3 minutos en segundos

    const startTimer = () => {
        const interval = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeRemaining--;

            if (timeRemaining < 0) {
                clearInterval(interval);
                /* Expiro el codigo */
                console.error(`Mensaje: El codigo de verificación caducó`);
                const msgerr = "• " + "El codigo de verificación caducó";
                createErrors(msgerr);
                const boton = document.createElement("button");
                boton.textContent = "Reenviar Código"
                boton.classList.add("btn");
                boton.classList.add("btn-primary");
                divErrores.append(boton);

                // Agregar el listener al botón después de que ha sido añadido al DOM
                boton.addEventListener("click", () => {
                    shouldWarnBeforeUnload = false; // No mostrar alerta al navegar
                    window.location.href = "validarDocumento.html";
                });

                modal.showModal();
            }
        }, 1000);
    };

    startTimer();

    /* ---------------Formulario--------------- */
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        shouldWarnBeforeUnload = false;

        const url = "https://munisayan.gob.pe/tramite/api/user/ResPas";

        const formData = new FormData(form);
        const documento = localStorage.getItem('documento');

        const formObject = {
            documento: documento
        };

        for (const [key, value] of formData) {
            formObject[key] = value;
        }

        if (formObject.Password !== formObject.confirmPassword) {
            console.error("Mensaje: Las contraseñas no coinciden");
            const msgerr = "• " + "Las contraseñas no coinciden";
            createErrors(msgerr);
            modal.showModal();
            shouldWarnBeforeUnload = true; // Restablecer la alerta en caso de error
            return;
        }

        loadingDiv.showModal();

        await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            loadingDiv.close();

            if (res.status === 200) {

                return res.json().then(respuesta => {
                    window.location.href = 'messageSuccessChangePassword.html';
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
                    if (respuesta.errors) {
                        console.error(`Mensaje: ${respuesta.errors[0].msg}`);
                        const msgerr = "• " + respuesta.errors[0].msg;
                        createErrors(msgerr);
                        modal.showModal();
                    } else if (respuesta.msg) {
                        /* Expiro el codigo */
                        console.error(`Mensaje: ${respuesta.msg}`);
                        const msgerr = "• " + respuesta.msg;
                        createErrors(msgerr);
                        const boton = document.createElement("button");
                        boton.textContent = "Reenviar Código"
                        boton.classList.add("btn");
                        boton.classList.add("btn-primary");
                        divErrores.append(boton);

                        // Agregar el listener al botón después de que ha sido añadido al DOM
                        boton.addEventListener("click", () => {
                            shouldWarnBeforeUnload = false; // No mostrar alerta al navegar
                            window.location.href = "validarDocumento.html";
                        });

                        modal.showModal();
                        shouldWarnBeforeUnload = true; // Restablecer la alerta en caso de error
                    }
                });
            } else {
                // Otro código de estado
                console.log("Error en la petición. Estado: ", res.status);
            }
        }).catch(error => {
            loadingDiv.close();
            createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
            modal.showModal();
            console.error(error);
            shouldWarnBeforeUnload = true; // Restablecer la alerta en caso de error
        });
    });
})


window.addEventListener('beforeunload', function (e) {
    if (!shouldWarnBeforeUnload) {
        return;
    }
    e.preventDefault();
    const confirmationMessage = '¿Seguro que deseas abandonar la página?';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
});
