//****************************************************************************
//---------------------------CARGAR DEPARTAMENTOS------------------------------
//****************************************************************************
const wrapper_departamento = document.querySelector("#wrapper_departamento"),
    selectBtn_departamento = document.querySelector("#select-btn_departamento"),
    searchInp_departamento = document.querySelector("#input-search_departamento"),
    options_departamento = document.querySelector("#opt_departamento");

let selectDepartamentoId = "";
let departamentos = [];

const urlDepartamentos = "http://munisayan.gob.pe/tramite/api/departamento";

const cargaDepartamentos = async () => {
    try {
        const response = await fetch(urlDepartamentos, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        departamentos = data.dpto;

        return departamentos;
    } catch (error) {
        console.error("Error al obtener la lista de departamentos:", error);
        return [];
    }
};

function updateDepartment(selectedLi) {
    searchInp_departamento.value = "";
    addDepartamentos(selectedLi.innerText);
    wrapper_departamento.classList.remove("active");
    selectBtn_departamento.firstElementChild.innerHTML = selectedLi.innerText;
    selectBtn_provincia.firstElementChild.innerHTML = "Seleccione...";
    selectBtn_distrito.firstElementChild.innerHTML = "Seleccione...";

    const li = "<li>Seleccione una Provincia</li>";
    options_distrito.innerHTML= "";
    options_distrito.insertAdjacentHTML("beforeend", li);

    selectDepartamentoId = selectedLi.getAttribute("data-departamento-id");

    cargaProvincias(selectDepartamentoId);
}

const addDepartamentos = (selectedDepartment = "") => {
    options_departamento.innerHTML = "";
    departamentos.forEach(departamento => {
        let isSelected = departamento.Descripcion === selectedDepartment ? "selected" : "";
        let li = `<li onclick="updateDepartment(this)" class="${isSelected}" data-departamento-id="${departamento.id}">${departamento.Descripcion}</li>`;
        options_departamento.insertAdjacentHTML("beforeend", li);
    });
}

const executeAddDepartment = async () => {
    // Llenamos la variable departamentos
    await cargaDepartamentos();

    addDepartamentos();

    searchInp_departamento.addEventListener("keyup", () => {
        let arr = [];
        let searchedVal = searchInp_departamento.value.toLowerCase();
        arr = departamentos.filter(data => {
            return data.Descripcion.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateDepartment(this)" data-departamento-id="${data.id}">${data.Descripcion}</li>`).join("");

        options_departamento.innerHTML = arr ? arr : `<p>Departamento no Encontrado</p>`;
    });
}

executeAddDepartment()

selectBtn_departamento.addEventListener("click", () => {
    wrapper_departamento.classList.toggle("active");
    wrapper_provincia.classList.remove("active");
    wrapper_distrito.classList.remove("active");
});

//****************************************************************************
//---------------------------CARGAR PROVINCIAS------------------------------
//****************************************************************************
const wrapper_provincia = document.querySelector("#wrapper_provincia"),
    selectBtn_provincia = document.querySelector("#select-btn_provincia"),
    searchInp_provincia = document.querySelector("#input-search_provincia"),
    options_provincia = document.querySelector("#opt_provincia");

let selectDistritoId = "";
let provincias = [];

const cargaProvincias = async (selectDepartamentoId) => {

    const urlprovincias = `http://munisayan.gob.pe/tramite/api/provincia/${selectDepartamentoId}`;

    try {
        const response = await fetch(urlprovincias, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        // Se llenan los provincias con los datos obtenidos
        provincias = data;

        executeAddProvince();

        return provincias;
    } catch (error) {
        console.error("Error al obtener la lista de provincias:", error);
        return [];
    }
};

function updateProvince(selectedLi) {
    searchInp_provincia.value = "";
    addProvincia(selectedLi.innerText);
    wrapper_provincia.classList.remove("active");
    selectBtn_provincia.firstElementChild.innerHTML = selectedLi.innerText;
    selectBtn_distrito.firstElementChild.innerHTML = "Seleccione...";

    selectDistritoId = selectedLi.getAttribute("data-provincia-id");
    
    cargaDistritos(selectDistritoId);
}

const addProvincia = (selectedProvince = "") => {
    options_provincia.innerHTML = "";
    provincias.forEach(provincia => {
        let isSelected = provincia.Descripcion === selectedProvince ? "selected" : "";
        let li = `<li onclick="updateProvince(this)" class="${isSelected}" data-provincia-id="${provincia.id}">${provincia.Descripcion}</li>`;
        options_provincia.insertAdjacentHTML("beforeend", li);
    });
}

const executeAddProvince = async () => {

    addProvincia();

    searchInp_provincia.addEventListener("keyup", () => {
        let arr = [];
        let searchedVal = searchInp_provincia.value.toLowerCase();
        arr = provincias.filter(data => {
            return data.Descripcion.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateProvince(this)" data-provincia-id="${data.id}">${data.Descripcion}</li>`).join("");

        options_provincia.innerHTML = arr ? arr : `<p>Provincia inexistente</p>`;
    });
}

selectBtn_provincia.addEventListener("click", () => {
    wrapper_provincia.classList.toggle("active");
    wrapper_distrito.classList.remove("active");
    wrapper_departamento.classList.remove("active");
})

//****************************************************************************
//---------------------------CARGAR DISTRITO------------------------------
//****************************************************************************
const wrapper_distrito = document.querySelector("#wrapper_distrito"),
    selectBtn_distrito = document.querySelector("#select-btn_distrito"),
    searchInp_distrito = document.querySelector("#input-search_distrito"),
    options_distrito = document.querySelector("#opt_distrito");

let distritos = [];

const cargaDistritos = async (selectDistritoId) => {

    const urlDistritos = `http://munisayan.gob.pe/tramite/api/distrito/${selectDistritoId}`;
    
    try {
        const response = await fetch(urlDistritos, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        distritos = data;

        executeAddDistrict();

        return distritos;
    } catch (error) {
        console.error("Error al obtener la lista de provincias:", error);
        return [];
    }
};

const updateDistrict = (selectedLi) => {
    searchInp_distrito.value = "";
    addDistrito(selectedLi.innerText);
    wrapper_distrito.classList.remove("active");
    selectBtn_distrito.firstElementChild.innerHTML = selectedLi.innerText;
}

const addDistrito = (selectedDistrict = "") => {
    options_distrito.innerHTML = "";
    distritos.forEach(distrito => {
        let isSelected = distrito.Descripcion === selectedDistrict ? "selected" : "";
        let li = `<li onclick="updateDistrict(this)" class="${isSelected}" data-provincia-id="${distrito.id}">${distrito.Descripcion}</li>`;
        options_distrito.insertAdjacentHTML("beforeend", li);
    })
}

const executeAddDistrict = async () => {

    addDistrito();

    searchInp_distrito.addEventListener("keyup", () => {
        let arr = [];
        let searchedVal = searchInp_distrito.value.toLowerCase();
        arr = distritos.filter(data => {
            return data.Descripcion.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateDistrict(this)" data-provincia-id="${data.id}">${data.Descripcion}</li>`).join("");

        options_distrito.innerHTML = arr ? arr : `<p>Distrito inexistente</p>`;
    });
}

selectBtn_distrito.addEventListener("click", ()=>{
    wrapper_distrito.classList.toggle("active");
    wrapper_departamento.classList.remove("active");
    wrapper_provincia.classList.remove("active");
})