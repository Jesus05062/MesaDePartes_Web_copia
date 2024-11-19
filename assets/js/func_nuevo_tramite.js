document.addEventListener("DOMContentLoaded", () => {

    const insertarValorPredeterminado = (idCampo, valor) => {
        const a = localStorage.getItem(valor);
        if (a) {
            document.getElementById(idCampo).value = a;
        }
    }

    insertarValorPredeterminado("id_dniFirmante", "documento");
    insertarValorPredeterminado("id_nombreFirmante", "Nombres");
    insertarValorPredeterminado("id_direccion", "direccion");
    insertarValorPredeterminado("id_telefono", "celular");
    insertarValorPredeterminado("id_email", "email");
    insertarValorPredeterminado("id_dniFirmante", "documento");
    insertarValorPredeterminado("id_dniFirmante", "documento");

    /* ---------------Funcionalidad del modal Informativo --------------- */
    const btnCerrarModalAlerta = document.querySelector("#btn-cerrar-message-alert");
    const modalAlerta = document.querySelector("#modal-message-alert");

    /* modalAlerta.showModal(); */
    btnCerrarModalAlerta.addEventListener("click", () => {
        modalAlerta.close();
    });

    /* ---------------Funcionalidad del modal Modo de Emision--------------- */
    /* const btnAbrirModalEmision = document.querySelector("#btn-abrir-modal");
    const btnCerrarModalEmision = document.querySelector("#btn-cerrar-modal");
    const modalEmision = document.querySelector("#modal");

    btnAbrirModalEmision.addEventListener("click", () => {
        modalEmision.showModal();
    });
    btnCerrarModalEmision.addEventListener("click", () => {
        modalEmision.close();
    }); */

    /* ---------------Funcionalidad del modal info de Cargo--------------- */
    const btnAbrirModalCargo = document.querySelector("#btn-abrir-info-cargo");
    const btnCerrarModalCargo = document.querySelector("#btn-cerrar-info-cargo");
    const modalCargo = document.querySelector("#modal-info-cargo");

    btnAbrirModalCargo.addEventListener("click", () => {
        modalCargo.showModal();
    });
    btnCerrarModalCargo.addEventListener("click", () => {
        modalCargo.close();
    });

    /* ---------------Funcionalidad del modal info de Anexo--------------- */
    const btnAbrirModalAnexo = document.querySelector("#btn-abrir-info-anexo");
    const btnCerrarModalAnexo = document.querySelector("#btn-cerrar-info-anexo");
    const modalAnexo = document.querySelector("#modal-info-anexo");

    btnAbrirModalAnexo.addEventListener("click", () => {
        modalAnexo.showModal();
    });
    btnCerrarModalAnexo.addEventListener("click", () => {
        modalAnexo.close();
    });

})

/* ---------------Funcionalidad Tipo de Emision--------------- */
/* const tipoEmision = document.querySelector('select[name="tipoEmision"]');

tipoEmision.addEventListener("change", function () {
    const selectedValue = this.value;

    const rucField = document.querySelector("#id_rucField");
    const inputRuc = rucField.querySelector("input");

    if (selectedValue === "Institucional") {
        rucField.style.display = "block";
        inputRuc.setAttribute("required", "required");
    } else {
        rucField.style.display = "none";
        inputRuc.removeAttribute("required");
    }
}) */

/* ---------------------CARGAR DATOS--------------------- */

document.addEventListener("DOMContentLoaded", async () => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        //option.classList.add(nc);
        option.setAttribute("id", nc);
        option.value = e.id;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    const createOptionTipoExpediente = (e, c, nc) => {
        const option = document.createElement("option");
        //option.classList.add(nc);
        option.setAttribute("id", nc);
        option.value = e.Descripcion;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    const createSeleccione = (c) => {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Seleccione...";
        c.append(option);
    }

    /* ---------------------CARGAR DEPARTAMENTOS--------------------- */
    /* const urlDepartamento = "http://munisayan.gob.pe/tramite/api/departamento";
    const departamentoSelect = document.getElementById("id_departamento");

    await fetch(urlDepartamento, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {

            createSeleccione(departamentoSelect);

            data.dpto.forEach(departamento => createOption(departamento, departamentoSelect, "departamento"));
            // Establecer el valor del departamento desde localStorage
            const storedDepartamento = localStorage.getItem("departamento");
            if (storedDepartamento) {
                // Encontrar la opción que coincide con el valor almacenado en localStorage
                for (let i = 0; i < departamentoSelect.options.length; i++) {
                    if (departamentoSelect.options[i].text === storedDepartamento) {
                        departamentoSelect.selectedIndex = i;
                        departamentoSelect.dispatchEvent(new Event('change'));
                        break;
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error al obtener la lista de departamentos:", error);
        }); */


    /* ---------------------CARGAR PROVINCIAS--------------------- */
    const provinciaSelect = document.getElementById("id_provincia");

    /* departamentoSelect.addEventListener("change", async () => {
        provinciaSelect.innerHTML = "";
        distritoSelect.innerHTML = "";
        createSeleccione(provinciaSelect);
        const selectDepartamentoId = departamentoSelect.value;
        const urlProvincia = `http://munisayan.gob.pe/tramite/api/provincia/${selectDepartamentoId}`;

        await fetch(urlProvincia, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {


                data.forEach(provincia => createOption(provincia, provinciaSelect, "provincia"));

                // Establecer el valor del departamento desde localStorage
                const storedProvincia = localStorage.getItem("provincia");
                if (storedProvincia) {
                    // Encontrar la opción que coincide con el valor almacenado en localStorage
                    for (let i = 0; i < provinciaSelect.options.length; i++) {
                        if (provinciaSelect.options[i].text === storedProvincia) {
                            provinciaSelect.selectedIndex = i;
                            provinciaSelect.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Error al obtener la lista de provincias:", error);
            });
    }); */

    /* ---------------------CARGAR DISTRITOS--------------------- */
    const distritoSelect = document.getElementById("id_distrito");

    /* provinciaSelect.addEventListener("change", async () => {
        distritoSelect.innerHTML = "";

        createSeleccione(distritoSelect);

        const selectProvinciaId = provinciaSelect.value;
        const urlDistrito = `http://munisayan.gob.pe/tramite/api/distrito/${selectProvinciaId}`;

        await fetch(urlDistrito, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {

                data.forEach(distrito => createOption(distrito, distritoSelect, "distrito"));
                // Establecer el valor del departamento desde localStorage
                const storedDistrito = localStorage.getItem("distrito");
                if (storedDistrito) {
                    // Encontrar la opción que coincide con el valor almacenado en localStorage
                    for (let i = 0; i < distritoSelect.options.length; i++) {
                        if (distritoSelect.options[i].text === storedDistrito) {
                            distritoSelect.selectedIndex = i;
                            distritoSelect.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Error al obtener la lista de distritos:", error);
            });

    }); */

    /* ---------------------CARGAR DEPENDENCIAS--------------------- */
    /* const dependenciaSelect = document.querySelector("#id_dependencia");
    const urlDependencias = "https://munisayan.gob.pe/tramite/api/unidadOrganica";

    await fetch(urlDependencias, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {

            data.uni.forEach(dependencia => createOption(dependencia, dependenciaSelect, "dependencia"));
        })
        .catch(error => {
            console.error("Error al obtener la lista de distritos:", error);
        }); */

    /* ---------------------CARGAR TIPO DE EXPEDIENTE --------------------- */
    /* const tipoExpedienteSelect = document.querySelector("#id_tipoDocumento");
    const urlTipoExpediente = "https://munisayan.gob.pe/tramite/api/tipoexpediente";

    await fetch(urlTipoExpediente, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {

            data.tipo.forEach(tipoExpediente => createOptionTipoExpediente(tipoExpediente,tipoExpedienteSelect, "dependencia"));
        })
        .catch(error => {
            console.error("Error al obtener la lista de distritos:", error);
        }); */
});