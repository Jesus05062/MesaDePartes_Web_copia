//****************************************************************************
//---------------------------CARGAR TIPO DE EXPEDIENTES------------------------------
//****************************************************************************
const wrapper_dependencia = document.querySelector("#wrapper_dependencia"),
    selectBtn_dependencia = document.querySelector("#select-btn_dependencia"),
    searchInp_dependencia = document.querySelector("#input-search_dependencia"),
    options_dependencia = document.querySelector("#opt_dependencia");

let dependencias = [];

const urlDependencias = "https://munisayan.gob.pe/tramite/api/unidadOrganica";

const cargaDependencias = async () => {
    try {
        const response = await fetch(urlDependencias, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        // Se llenan las dependencias con los datos obtenidos
        dependencias = data.uni.map(t => t.Descripcion);

        return dependencias;
    } catch (error) {
        console.error("Error al obtener la lista dependencias:", error);
        return [];
    }
};

// Mueve esta función fuera de `imprimir` para que esté disponible globalmente
function updateDependencias(selectedLi) {
    searchInp_dependencia.value = "";
    addDependencia(selectedLi.innerText);
    wrapper_dependencia.classList.remove("active");
    selectBtn_dependencia.firstElementChild.innerHTML = selectedLi.innerText;
}

const addDependencia = (selectedArea = "") => {
    options_dependencia.innerHTML = "";
    dependencias.forEach(area => {
        let isSelected = area === selectedArea ? "selected" : "";
        let li = `<li onclick="updateDependencias(this)" class="${isSelected}">${area}</li>`;
        options_dependencia.insertAdjacentHTML("beforeend", li);
    });
}

const executeAddDependencies = async () => {
    // Llenamos la variable dependencias
    await cargaDependencias();

    addDependencia();

    searchInp_dependencia.addEventListener("keyup", () => {
        let arr = [];
        let searchedVal = searchInp_dependencia.value.toLowerCase();
        arr = dependencias.filter(data => {
            return data.toLowerCase().startsWith(searchedVal);
        }).map(data => `<li onclick="updateDependencias(this)">${data}</li>`).join("");

        options_dependencia.innerHTML = arr ? arr : `<p>Opps! Esta area no existe</p>`;
    });
}

executeAddDependencies()

selectBtn_dependencia.addEventListener("click", () => {
    wrapper_dependencia.classList.toggle("active");
});
