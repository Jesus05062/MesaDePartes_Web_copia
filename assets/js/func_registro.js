
document.addEventListener("DOMContentLoaded", function () {

    /* ---------------Funcionalidad del modal Informativo --------------- */
    const btnCerrarModalAlerta = document.querySelector("#btn-cerrar-message-alert");
    const modalAlerta = document.querySelector("#modal-message-alert");

    modalAlerta.showModal();
    btnCerrarModalAlerta.addEventListener("click", () => {
        modalAlerta.close();
    });


    /* ---------------Funcionalidad de los Inputs--------------- */
    const documentotipoSelect = document.querySelector('select[name="TipoDocumento"]');

    // Escuchar cambios en el select
    documentotipoSelect.addEventListener("change", function () {
        // Obtener el valor seleccionado
        const selectedValue = this.value;

        const nombresField = document.querySelector("#id_nombres");
        const inputNombres = nombresField.querySelector("input");
        const paternoField = document.querySelector("#id_paterno");
        const inputPaterno = paternoField.querySelector("input");
        const maternoField = document.querySelector("#id_materno");
        const inputMaterno = maternoField.querySelector("input");
        const sexoField = document.querySelector("#id_sexo");
        const selectSexo = sexoField.querySelector("select");
        const razonsocialField = document.querySelector("#id_razonsocial");
        const inputRazonsocial = razonsocialField.querySelector("input");


        // Verificar el valor seleccionado
        if (selectedValue === 'Registro Único de Contribuyentes') {
            // Ocultar campos nombres, paterno, materno y sexo, y mostrar campo razonsocial
            nombresField.style.display = "none";
            inputNombres.removeAttribute("required");

            paternoField.style.display = "none";
            inputPaterno.removeAttribute("required");

            maternoField.style.display = "none";
            inputMaterno.removeAttribute("required");

            sexoField.style.display = "none";
            selectSexo.removeAttribute("required");

            razonsocialField.style.display = "block";
            inputRazonsocial.setAttribute("required", "required");
        } else {
            // Mostrar campos nombres, paterno, materno y sexo, y ocultar campo razonsocial
            nombresField.style.display = "block";
            inputNombres.setAttribute("required", "required");

            paternoField.style.display = "block";
            inputPaterno.setAttribute("required", "required");

            maternoField.style.display = "block";
            inputMaterno.setAttribute("required", "required");

            sexoField.style.display = "block";
            selectSexo.setAttribute("required", "required");

            razonsocialField.style.display = "none";
            inputRazonsocial.removeAttribute("required");

        }
    });

    /* ---------------Funcionalidad del modal--------------- */
    const btnAbrirModal = document.querySelector("#btn-abrir-modal");
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
    const modal = document.querySelector("#modal");

    btnAbrirModal.addEventListener("click", () => {
        modal.showModal();
    });
    btnCerrarModal.addEventListener("click", () => {
        modal.close();
    });
    
});


