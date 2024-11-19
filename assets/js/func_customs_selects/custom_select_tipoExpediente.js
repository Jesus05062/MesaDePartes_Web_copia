//****************************************************************************
//---------------------------CARGAR TIPO DE EXPEDIENTES------------------------------
//****************************************************************************
const wrapper_tipoDocumento = document.querySelector("#wrapper_tipoDocumento"),
    selectBtn_tipoDocumento = document.querySelector("#select-btn_tipoDocumento"),
    searchInp_tipoDocumento = document.querySelector("#input-search_tipoDocumento"),
    options_tipoDocumento = document.querySelector("#opt_tipoDocumento");

let tiposExpedientes = [];

const urlTipoExpediente = "https://munisayan.gob.pe/tramite/api/tipoexpediente";

const cargaTipoExpediente = async () => {
    try {
        const response = await fetch(urlTipoExpediente, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        // Se llenan los tiposExpedientes con los datos obtenidos
        tiposExpedientes = data.tipo.map(t => t.Descripcion);

        return tiposExpedientes;
    } catch (error) {
        console.error("Error al obtener la lista de tipos de expedientes:", error);
        return [];
    }
};

// Mueve esta función fuera de `executeAddType` para que esté disponible globalmente
function updateName(selectedLi) {
    searchInp_tipoDocumento.value = "";
    addCountry(selectedLi.innerText);
    wrapper_tipoDocumento.classList.remove("active");
    selectBtn_tipoDocumento.firstElementChild.innerHTML = selectedLi.innerText;
}

const addCountry = (selectedCountry = "") => {
    options_tipoDocumento.innerHTML = "";
    tiposExpedientes.forEach(country => {
        let isSelected = country === selectedCountry ? "selected" : "";
        let li = `<li onclick="updateName(this)" class="${isSelected}">${country}</li>`;
        options_tipoDocumento.insertAdjacentHTML("beforeend", li);
    });
}

const executeAddTypeRecord = async () => {
    // Llenamos la variable tiposExpedientes
    await cargaTipoExpediente();

    addCountry();

    searchInp_tipoDocumento.addEventListener("keyup", () => {
        let arr = [];
        let searchedVal = searchInp_tipoDocumento.value.toLowerCase();
        arr = tiposExpedientes.filter(data => {
            return data.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateName(this)">${data}</li>`).join("");

        options_tipoDocumento.innerHTML = arr ? arr : `<p>Opps! Tipo no encontrado</p>`;
    });
}

executeAddTypeRecord()

selectBtn_tipoDocumento.addEventListener("click", () => {
    wrapper_tipoDocumento.classList.toggle("active");
});

