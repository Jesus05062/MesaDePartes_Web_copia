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

/* --------------------------------- PERFIL --------------------------------- */
document.getElementById("btn_open_perfil").addEventListener("click", open_close_perfil);

let side_perfil = document.getElementById("id_perfil");
let btn_open_perfil = document.getElementById("btn_open_perfil");

function open_close_perfil() {
    side_perfil.classList.toggle("perfil__side_move");
}

/* --------------------------------- EDITAR PERFIL --------------------------------- */
const btn_open_editar_perfil = document.querySelector("#id_editarPerfil");
const btn_close_perfil_datos = document.querySelector("#btn-cerrar-perfil-datos")
const side_editar_perfil = document.querySelector("#modal-perfil-datos");

btn_open_editar_perfil.addEventListener("click", () => {
    side_editar_perfil.showModal();
});

btn_close_perfil_datos.addEventListener("click", () => {
    side_editar_perfil.close();
});

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


/* ---------------------CARGAR DATOS--------------------- ------------------------------------------------------------------------------------------*/
/* ---------------------CARGAR DATOS--------------------- ------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", async () => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        option.setAttribute("id", nc);
        option.value = e.id;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    /* ---------------------CARGAR DEPARTAMENTOS--------------------- */
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
        });


    /* ---------------------CARGAR PROVINCIAS--------------------- */
    const provinciaSelect = document.getElementById("id_provincia_Field");
    const selectDepartamentoId = departamentoSelect.value;
    const urlProvincia = `http://munisayan.gob.pe/tramite/api/provincia/${selectDepartamentoId}`;

    departamentoSelect.addEventListener("change", async () => {

        await fetch(urlProvincia, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                provinciaSelect.innerHTML = "";
                distritoSelect.innerHTML = "";

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

    /* ---------------------CARGAR DISTRITOS--------------------- */
    const distritoSelect = document.getElementById("id_distrito_Field");

    provinciaSelect.addEventListener("change", async () => {

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
                distritoSelect.innerHTML = "";

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

    /* ----------------------CERRAR SESION----------------- */
    const btn_cerrarSesion = document.querySelector("#btn_cerrar_sesion");
    btn_cerrarSesion.addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";
    })
});

/* ---------------------CARGAR DATOS--------------------- ------------------------------------------------------------------------------------------*/
/* ---------------------CARGAR DATOS--------------------- ------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", async () => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        option.setAttribute("id", nc);
        option.value = e.id;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    /* ---------------------CARGAR DEPARTAMENTOS--------------------- */
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
        });


    /* ---------------------CARGAR PROVINCIAS--------------------- */
    const provinciaSelect = document.getElementById("id_provincia_Field");
    const selectDepartamentoId = departamentoSelect.value;
    const urlProvincia = `http://munisayan.gob.pe/tramite/api/provincia/${selectDepartamentoId}`;

    departamentoSelect.addEventListener("change", async () => {

        await fetch(urlProvincia, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                provinciaSelect.innerHTML = "";
                distritoSelect.innerHTML = "";

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

    /* ---------------------CARGAR DISTRITOS--------------------- */
    const distritoSelect = document.getElementById("id_distrito_Field");

    provinciaSelect.addEventListener("change", async () => {

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
                distritoSelect.innerHTML = "";

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

    /* ----------------------CERRAR SESION----------------- */
    const btn_cerrarSesion = document.querySelector("#btn_cerrar_sesion");
    btn_cerrarSesion.addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";
    })
});





