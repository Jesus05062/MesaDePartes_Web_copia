document.addEventListener("DOMContentLoaded", function () {

    const submitNuevoTramite = document.querySelector("form");
    const body__container = document.querySelector("#body__container");
    const modal_message_success = document.querySelector("#modal-message-success");

    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.getElementById("div-msg-error");

    const loadingDiv = document.querySelector("#loading");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
        divErrores.innerHTML = "";
    });

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(e);
        divErrores.append(space);
    };


    submitNuevoTramite.addEventListener("submit", function (event) {
        event.preventDefault();
        submitForm();
    });


    // Función para obtener una fecha en formato YYYY-MM-DD
    function formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    // Función para configurar las restricciones de fecha
    function setFechaRestricciones() {
        const fechaInput = document.querySelector("#id_fecha");
        const today = new Date();

        // Crear una lista de fechas válidas
        let validDates = [];

        for (let i = 0; validDates.length < 3; i++) {
            let currentDate = new Date();
            currentDate.setDate(today.getDate() - i);

            // Excluir sábados (6) y domingos (0)
            if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
                validDates.push(formatDate(currentDate));
            }
        }

        // Configurar la fecha mínima y máxima basadas en las fechas válidas
        fechaInput.setAttribute('min', validDates[validDates.length - 1]);
        fechaInput.setAttribute('max', validDates[0]);

        // Asegurar que la fecha actual en el input sea válida
        const currentValue = new Date(fechaInput.value);
        if (!validDates.includes(formatDate(currentValue))) {
            fechaInput.value = validDates[0];
        }

        // Deshabilitar fechas no válidas en el calendario
        fechaInput.addEventListener("input", function () {
            const selectedDate = new Date(this.value);
            if (!validDates.includes(formatDate(selectedDate))) {
                this.setCustomValidity("Por favor selecciona una fecha válida.");
            } else {
                this.setCustomValidity("");
            }
        });
    }

    setFechaRestricciones();

    // Validación del archivo cargado
    const fileInput = document.getElementById("id_archivocorto");
    if (fileInput) {
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file && file.size > 5 * 1024 * 1024) { // 5MB en bytes
                console.error(`Mensaje: El archivo excede los 5MB permitidos`);
                const msgerr = "• " + "Mensaje: El archivo excede los 5MB permitidos";
                createErrors(msgerr);
                modal.showModal();
                fileInput.value = ""; // Limpia el input si el archivo no pasa la validación
            }
        });
    }

    const submitForm = async () => {
        const formData = new FormData();

        const selectDepartamento = document.querySelector("#id_departamento");
        const selectProvincia = document.querySelector("#id_provincia");
        const selectDistrito = document.querySelector("#id_distrito");
        const selectDependencia = document.querySelector("#id_dependencia");

        const seltedDepartamento = selectDepartamento.options[selectDepartamento.selectedIndex].text;
        const seltedProvincia = selectProvincia.options[selectProvincia.selectedIndex].text;
        const seltedDistrito = selectDistrito.options[selectDistrito.selectedIndex].text;
        const seltedtDependencia = selectDependencia.options[selectDependencia.selectedIndex].text;

        // Archivo
        const archivoInput = document.querySelector("#id_archivocorto");
        const archivo = archivoInput.files[0];
        formData.append("archivo", archivo);

        // Cuerpo del mensaje
        const body = [
            {
                IdUsuario: localStorage.getItem("documento"),
                /* ModoEmision: document.querySelector("#id_modoEmision").value,
                Ruc: document.querySelector("#id_ruc").value, */
                TipoDocumento: document.querySelector("#id_tipoDocumento").value,
                Documento: document.querySelector("#id_documento").value,
                Folios: document.querySelector("#id_folios").value,
                /* Siglas: "Siglas 1", */
                Fecha: document.querySelector("#id_fecha").value,
                DocumentoFirmante: document.querySelector("#id_dniFirmante").value,
                NombreFirmante: document.querySelector("#id_nombreFirmante").value,
                CargoFirmante: document.querySelector("#id_cargoFirmante").value,

                Departamento: seltedDepartamento,
                Provincia: seltedProvincia,
                Distrito: seltedDistrito,

                Direccion: document.querySelector("#id_direccion").value,
                Telefono: document.querySelector("#id_telefono").value,
                CorreoElectronico: document.querySelector("#id_email").value,
                Asunto: document.querySelector("#id_asunto").value,
                Unidades: seltedtDependencia,
                Estado: true,
                EstadoTramite: "registrado",
                UrlAnexo: document.querySelector("#id_anexo").value,
                archivo: [
                    {
                        Archivo: "Contenido del archivo 1",
                        NombreArchivo: archivo.name
                    }
                ]
            }
        ];

        formData.append("body", JSON.stringify(body));

        const url = "https://munisayan.gob.pe/tramite/api/tds";

        loadingDiv.showModal();

        await fetch(url, {
            method: "POST",
            body: formData,

        }).then(res => {
            loadingDiv.close();

            divErrores.innerHTML = "";
            if (res.status === 200) {
                return res.json().then(respuesta => {
                    const numCorrelativo = document.getElementById("id_correlativoWeb");
                    numCorrelativo.innerHTML = respuesta.ids[0];
                    modal_message_success.removeAttribute("style");
                    body__container.setAttribute("style", "display: none");
                    console.log("Expediente Registrado");
                });
            } else if (res.status === 400) {
                return res.json().then(response => {
                    response.errors.forEach(error => {
                        console.error(`Mensaje: ${error}`);
                        const msgerr = "• " + error;
                        createErrors(msgerr);
                        modal.showModal();
                    })
                });
            } else if (res.status === 404) {
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
    }
});
