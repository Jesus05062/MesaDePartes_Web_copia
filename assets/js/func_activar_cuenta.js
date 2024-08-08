document.addEventListener("DOMContentLoaded", async () => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        //option.classList.add(nc);
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

    /* ---------------------CARGAR DEPARTAMENTOS--------------------- */
    const urlDepartamento = "http://munisayan.gob.pe/tramite/api/departamento";
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

        })
        .catch(error => {
            console.error("Error al obtener la lista de departamentos:", error);
        });


    /* ---------------------CARGAR PROVINCIAS--------------------- */
    const provinciaSelect = document.getElementById("id_provincia");

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
            })
            .catch(error => {
                console.error("Error al obtener la lista de provincias:", error);
            });
    });

    /* ---------------------CARGAR DISTRITOS--------------------- */
    const distritoSelect = document.getElementById("id_distrito");

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
            })
            .catch(error => {
                console.error("Error al obtener la lista de distritos:", error);
            });

    });
});

