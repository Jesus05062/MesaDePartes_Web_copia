document.addEventListener("DOMContentLoaded", async () => {

    const tabla_Seguimiento_uno = document.getElementById("tabla-seguimiento-one");
    const cerrar_tabla_Seguimiento_uno = document.getElementById("btn-cerrar-tabla-seguimiento-one");

    cerrar_tabla_Seguimiento_uno.addEventListener("click", function () {
        tabla_Seguimiento_uno.close();
    })

    tabla_Seguimiento_uno.showModal();

    const misTramites = document.querySelector("#id_misTramites");
    const loading = document.querySelector("#id_loading");

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(msgError);
        divErrores.append(space);
    };

    const crearDivColoreado = ( color = "", estado, celda ) => {
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.style.color = "white";
        div.style.borderRadius = "5px";
        div.style.padding = "5px";
        div.textContent = estado;
        celda.appendChild(div);
    }

    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.querySelector("#div-msg-error");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
        divErrores.innerHTML = "";
    });

    loading.style.display = "block";
    misTramites.style.display = "none";

    const documentUser = localStorage.getItem("documento");
    const btnRefresh = document.querySelector("#btn_refresh");

    const url = `http://munisayan.gob.pe/tramite/api/TdListadoByUser/${documentUser}`;

    /* btnRefresh.addEventListener("click", async () => { */
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 200) {

                const respuesta = await res.json();

                // Limpiar la tabla antes de insertar nuevos datos
                const tbody = document.querySelector("table tbody");
                tbody.innerHTML = "";

                // Verificar si hay datos
                if (respuesta.length === 0) {
                    const row = document.createElement("tr");
                    const cell = document.createElement("td");
                    cell.setAttribute("colspan", "8");
                    cell.textContent = "No se encontraron documentos";
                    row.appendChild(cell);
                    tbody.appendChild(row);

                    loading.style.display = "none";
                    misTramites.style.display = "block";
                } else {
                    // Insertar datos en la tabla
                    respuesta.forEach(element => {

                        const row = document.createElement("tr");
                        row.classList.add("align-middle");
                        row.style.fontSize = "14px";

                        const crearFilaExpediente = (element, campo, opciones = {}) => {
                            
                            const celda = document.createElement("td");

                            if (opciones.documento) {
                                celda.style.color = "blue"
                            }

                            if (opciones.div) {
                                const expediente = element[campo];
                                crearDivColoreado("black", expediente, celda);
                            }

                            if (opciones.colores) {
                                const estado = element[campo];
                                
                                if (estado === "registrado") {
                                    crearDivColoreado("#787543", estado, celda);
                                }else if(estado === "En Proceso"){
                                    crearDivColoreado("#e0d41f", estado, celda,)
                                }else if(estado === "Recibido"){
                                    crearDivColoreado("green", estado, celda,)
                                }else if(estado === "Completado"){
                                    crearDivColoreado("#2a91d6", estado, celda,)
                                }else if(estado === "Rechazado"){
                                    crearDivColoreado("red", estado, celda)
                                }else {
                                    celda.textContent = element[campo];
                                }
                            } else {
                                celda.textContent = element[campo];
                            }
                            row.appendChild(celda);
                        };

                        // Campo de "Solicitud" con icono
                        const solicitudCell = document.createElement("td");

                        const div = document.createElement("div");
                        div.style.cursor = "pointer";
                        div.title = "Seguimiento de expediente";

                        const boton = document.createElement("button");
                        boton.id = `${element.id}`;
                        boton.classList.add("text-primary");
                        boton.setAttribute("style", "background-color: white; border: none;");

                        const solicitudIcon = document.createElement("span");
                        solicitudIcon.textContent = "📄";

                        boton.appendChild(solicitudIcon);
                        boton.appendChild(document.createTextNode(` ${element.id}`));
                        div.appendChild(boton);
                        solicitudCell.appendChild(div);
                        row.appendChild(solicitudCell);

                        crearFilaExpediente(element, "Documento", { documento: true });
                        crearFilaExpediente(element, "Asunto");
                        crearFilaExpediente(element, "Fecha");
                        crearFilaExpediente(element, "Unidades");
                        crearFilaExpediente(element, "Expediente", { div: true });
                        crearFilaExpediente(element, "EstadoTramite", { colores: true });
                        crearFilaExpediente(element, "FechaModificacion");

                        // Campo de "url" con icono de descarga
                        const docCell = document.createElement("td");
                        const docLink = document.createElement("a");
                        if (element.archivo.length > 0) {
                            docLink.href = element.archivo[0].url;
                            const downloadIcon = document.createElement("span");
                            downloadIcon.textContent = "⬇️"; // Puedes usar un icono de font-awesome u otra fuente de iconos si lo prefieres
                            downloadIcon.title = "Descargar archivo adjunto";
                            docLink.appendChild(downloadIcon);
                        } else {
                            docLink.textContent = "No disponible";
                        }
                        docCell.appendChild(docLink);
                        row.appendChild(docCell);

                        tbody.appendChild(row);
                    });

                    loading.style.display = "none";
                    misTramites.style.display = "block";
                }

            }
            /* else if (res.status === 404) {
                   const respuesta = await res.json();
                   console.error(`Mensaje: ${respuesta.msg}`);
                   const msgerr = "• " + respuesta.msg;
                   createErrors(msgerr);
                   modal.showModal();
               } else if (res.status === 400) {
                   const respuesta = await res.json();
                   if (respuesta.errors) {
                       console.error(`Mensaje: ${respuesta.errors[0].msg}`);
                       const msgerr = "• " + respuesta.errors[0].msg;
                       createErrors(msgerr);
                       modal.showModal();
                   } else if (respuesta.msg) {
                       console.error(`Mensaje: ${respuesta.msg}`);
                       const msgerr = "• " + respuesta.msg;
                       createErrors(msgerr);
                       const boton = document.createElement("button");
                       boton.textContent = "Reenviar Código";
                       boton.classList.add("btn", "btn-primary");
                       divErrores.appendChild(boton);
   
                       boton.addEventListener("click", () => {
                           window.location.href = "restablecerContrasena.html";
                       });
   
                       modal.showModal();
                   }
               } */
            else {
                console.log("Error en la petición. Estado: ", res.status);
            }
        } catch (error) {
            const msgerr = "• " + "No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea pasiente.";
            createErrors(msgerr);
            modal.showModal();
            console.error("No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea pasiente.", error);
        }
    /* }); */
});
