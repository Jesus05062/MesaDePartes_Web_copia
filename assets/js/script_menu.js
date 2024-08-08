/* ---------------Funcionalidad del modal Message Success--------------- */
const modalSuccess = document.querySelector("#modal-message-success-update");
const divMensaje = document.getElementById("div-msg-success");

const createMensajeSuccess = (e) => {
    const msgError = document.createElement("p");
    msgError.style.height = "40px"
    const space = document.createElement("br");
    msgError.textContent = e;
    divMensaje.append(e);
    divMensaje.append(space);

    const boton = document.createElement("button");
    boton.textContent = "De Acuerdo";
    boton.style.marginTop = "20px";
    boton.classList.add("btn", "btn-primary");
    boton.id = "id_de_acuerdo"
    divMensaje.append(boton);

    const botonFinalizarEdicionDatos = document.querySelector("#id_de_acuerdo");

    botonFinalizarEdicionDatos.addEventListener("click", () => {
        modalSuccess.close();
        side_editar_perfil.close();
        divMensaje.innerHTML = "";
    });
};

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

/* --------------------------------- PERFIL --------------------------------- */
let side_perfil = document.getElementById("id_perfil");
let btn_open_perfil = document.getElementById("btn_open_perfil");
let icon_perfil = document.getElementById("id_icon_user");

btn_open_perfil.addEventListener("click", open_close_perfil);

function open_close_perfil() {
    side_perfil.classList.toggle("perfil__side_move");
}

//Ejecutar función en el evento click
document.getElementById("btn_open").addEventListener("click", open_close_menu);

//Declaramos variables
let side_menu = document.getElementById("menu_side");
let btn_open = document.getElementById("btn_open");
let body = document.getElementById("body");

//Evento para mostrar y ocultar menú
function open_close_menu() {
    body.classList.toggle("body_move");
    side_menu.classList.toggle("menu__side_move");
    icon_perfil.classList.toggle("icon_perfil__move");
}

//Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página

if (window.innerWidth < 760) {
    body.classList.add("body_move");
    side_menu.classList.add("menu__side_move");
}

//Haciendo el menú responsive(adaptable)

window.addEventListener("resize", function () {

    if (window.innerWidth > 760) {
        body.classList.remove("body_move");
        side_menu.classList.remove("menu__side_move");
    }

    if (window.innerWidth < 760) {
        body.classList.add("body_move");
        side_menu.classList.add("menu__side_move");
    }
});

/* --------------------------------- EDITAR PERFIL --------------------------------- */
const btn_open_editar_perfil = document.querySelector("#id_editarPerfil");
/* const btn_close_perfil_datos = document.querySelector("#btn-cerrar-perfil-datos") */
const side_editar_perfil = document.querySelector("#modal-perfil-datos");

btn_open_editar_perfil.addEventListener("click", () => {
    side_editar_perfil.showModal();
});

/* btn_close_perfil_datos.addEventListener("click", () => {
    side_editar_perfil.close();
}); */

document.addEventListener("DOMContentLoaded", () => {

    const insertarValorPredeterminado = (idCampo, valor) => {
        const a = localStorage.getItem(valor);
        if (a) {
            document.getElementById(idCampo).value = a;
        }
    }
    insertarValorPredeterminado("id_direccion_Field", "direccion");
    insertarValorPredeterminado("id_telefono_Field", "celular");
    insertarValorPredeterminado("id_email_Field", "email");

    const nameUser = document.querySelector("#id_documento_Field");
    nameUser.textContent = localStorage.getItem("documento");
    const documentUser = document.querySelector("#id_nombre_Field");
    documentUser.textContent = localStorage.getItem("Nombres");
})

/* ---------------------CARGAR DATOS EDITAR DATOS DEL PERFIL---------------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", async () => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        option.setAttribute("id", nc);
        option.value = e.id;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    const createSeleccione = (c) => {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Seleccione...";
        c.append(option);
    }

    // ---------------------CARGAR DEPARTAMENTOS--------------------- 
    const urlDepartamento = "http://munisayan.gob.pe/tramite/api/departamento";
    const departamentoSelect = document.getElementById("id_departamento_Field");

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


        })
        .catch(error => {
            console.error("Error al obtener la lista de departamentos:", error);
        });

    // ---------------------CARGAR PROVINCIAS--------------------- 
    const provinciaSelect = document.getElementById("id_provincia_Field");

    departamentoSelect.addEventListener("change", async () => {
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
    });

    // ---------------------CARGAR DISTRITOS---------------------
    const distritoSelect = document.getElementById("id_distrito_Field");
    provinciaSelect.addEventListener("change", async () => {
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
    });
});

/* ---------------------EDITAR DATOS DEL PERFIL---------------------------------------------------------------------------------------------------------------*/

const loadingDivUpdate = document.querySelector("#loading");

const selectDepartamento = document.querySelector("#id_departamento_Field");
const selectProvincia = document.querySelector("#id_provincia_Field");
const selectDistrito = document.querySelector("#id_distrito_Field");

const btnActualizarDatos = document.querySelector("#btn_actualizar_datos");

btnActualizarDatos.addEventListener("click", async (event) => {
    event.preventDefault();

    loadingDivUpdate.showModal();

    const seltedDepartamento = selectDepartamento.options[selectDepartamento.selectedIndex].text;
    const seltedProvincia = selectProvincia.options[selectProvincia.selectedIndex].text;
    const seltedDistrito = selectDistrito.options[selectDistrito.selectedIndex].text;

    const url = "https://munisayan.gob.pe/tramite/api/user/Update";

    const body = {
        "id": Number(localStorage.getItem("id")),
        "email": document.querySelector("#id_email_Field").value,
        "celular": document.querySelector("#id_telefono_Field").value,
        "departamento": seltedDepartamento,
        "provincia": seltedProvincia,
        "distrito": seltedDistrito,
        "direccion": document.querySelector("#id_direccion_Field").value
    }

    //console.log(JSON.stringify(body));

    await fetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {

        loadingDivUpdate.close();

        if (res.status === 200) {
            return res.json().then(respuesta => {
                console.log(`Mensaje: ${respuesta.msg}`);
                const msg = "• " + respuesta.msg;
                createMensajeSuccess(msg);
                modalSuccess.showModal();
                localStorage.setItem("departamento", seltedDepartamento);
                localStorage.setItem("provincia", seltedProvincia);
                localStorage.setItem("distrito", seltedDistrito);
                localStorage.setItem("direccion", document.querySelector("#id_direccion_Field").value);
                localStorage.setItem("email", document.querySelector("#id_email_Field").value);
                localStorage.setItem("celular", document.querySelector("#id_telefono_Field").value);
            });
        } else if (res.status === 404) {
            return res.json().then(respuesta => {
                console.error(`Mensaje: ${respuesta.msg}`);
                const msgerr = "• " + respuesta.msg;
                createErrors(msgerr);
                modal.showModal();
            });
        } else if (res.status === 500) {
            return res.json().then(respuesta => {
                console.error(`Mensaje: ${respuesta.msg}`);
                const msgerr = "• " + respuesta.msg;
                createErrors(msgerr);
                modal.showModal();
            });
        } else {
            // Otro código de estado
            console.log("Error en la petición. Estado: ", res.status);
        }

    }).catch(error => {
        createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
        modal.showModal();
        console.error(error);
    })
});

/* ----------------------CERRAR SESION----------------- */
const btn_cerrarSesion = document.querySelector("#btn_cerrar_sesion");
btn_cerrarSesion.addEventListener("click", () => {

    localStorage.removeItem("Nombres");
    localStorage.removeItem("id");
    localStorage.removeItem("documento");
    localStorage.removeItem("departamento");
    localStorage.removeItem("provincia");
    localStorage.removeItem("distrito");
    localStorage.removeItem("direccion");
    localStorage.removeItem("email");
    localStorage.removeItem("celular");

    localStorage.setItem("Tok", "false");

    window.location.href = "login.html";
})


