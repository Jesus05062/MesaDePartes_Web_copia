document.addEventListener("DOMContentLoaded", async () => {

    const misTramites = document.querySelector("#id_misTramites");
    const loading = document.querySelector("#id_loading");
    const loadingSubsanar = document.querySelector("#loading");

    const modalSuccess = document.querySelector("#modal-message-success-update");
    const divMensaje = document.getElementById("div-msg-success");

    const createOptionTipoExpediente = (e, c, nc) => {
        const option = document.createElement("option");
        //option.classList.add(nc);
        option.setAttribute("id", nc);
        option.value = e.Descripcion;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    //-------------------- CARGAR EL TIPO DOCUMETNO DE SUBSANACION-------------------------
    const tipoExpedienteSelect = document.querySelector("#id_tipoDocumento_subsanar");
    const urlTipoExpediente = "https://munisayan.gob.pe/tramite/api/tipoexpediente";

    await fetch(urlTipoExpediente, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {

            data.tipo.forEach(tipoExpediente => createOptionTipoExpediente(tipoExpediente, tipoExpedienteSelect, "dependencia"));
        })
        .catch(error => {
            console.error("Error al obtener la lista de distritos:", error);
        });


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

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(msgError);
        divErrores.append(space);
    };

    const crearDivColoreado = (color = "", estado = "", celda) => {
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.style.color = "white";
        div.style.borderRadius = "5px";
        div.style.padding = "5px";
        div.textContent = estado;
        celda.appendChild(div);
    };

    const applyEstadoColor = (estado) => {
        if (estado === "Por Recibir") return "#787543";
        if (estado === "En Proceso") return "#e0d41f";
        if (estado === "Recibido") return "green";
        if (estado === "Completado") return "#2a91d6";
        if (estado === "Rechazado" || estado === "Observado") return "red";
        return "";
    };

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
    const filterDate = document.querySelector("#filterDate");
    const searchSolicitud = document.querySelector("#searchSolicitud");
    const dateRangeInputs = document.querySelector("#dateRangeInputs");
    const startDate = document.querySelector("#startDate");
    const endDate = document.querySelector("#endDate");

    const url = `http://munisayan.gob.pe/tramite/api/TdListadoByUser/${documentUser}`;

    let tramitesData = [];

    const fetchData = async () => {
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 200) {
                tramitesData = await res.json();
                applyFilters();
            } else {
                console.log("Error en la petición. Estado: ", res.status);
                const msgerr = `• Error en la petición. Estado: ${res.status}`;
                createErrors(msgerr);
                modal.showModal();
            }
        } catch (error) {
            const msgerr = "• No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea paciente.";
            createErrors(msgerr);
            modal.showModal();
            console.error("No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea paciente.", error);
        }
    };

    const renderTable = (data) => {
        // Limpiar la tabla antes de insertar nuevos datos
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = "";

        // Verificar si hay datos
        if (data.length === 0) {
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
            data.forEach(element => {

                const row = document.createElement("tr");
                row.classList.add("align-middle");
                row.style.fontSize = "14px";

                const crearFilaExpediente = (element, campo, opciones = {}, campoDos = "") => {
                    const celda = document.createElement("td");

                    if (opciones.documento) {
                        celda.style.color = "blue";
                    }

                    if (opciones.div) {
                        const expediente = element[campo];
                        crearDivColoreado("black", expediente, celda);
                    }

                    if (opciones.colores) {
                        const estado = element[campo];

                        if (estado === "registrado") {
                            crearDivColoreado("#787543", estado, celda);
                        } else if (estado === "En Proceso") {
                            crearDivColoreado("#e0d41f", estado, celda);
                        } else if (estado === "Recibido") {
                            crearDivColoreado("green", estado, celda);
                        } else if (estado === "Completado") {
                            crearDivColoreado("#2a91d6", estado, celda);
                        } else if (estado === "Rechazado") {
                            crearDivColoreado("red", estado, celda);
                        } else {
                            celda.textContent = element[campo];
                        }
                    } else {
                        celda.textContent = element[campo];
                        if (campoDos) {
                            celda.appendChild(document.createTextNode(` ${element[campoDos]}`));
                        }
                    }
                    row.appendChild(celda);
                };

                // Campo de "Solicitud" con icono
                const solicitudCell = document.createElement("td");

                const div = document.createElement("div");
                div.style.cursor = "pointer";
                div.title = "Seguimiento de expediente";

                const boton = document.createElement("button");
                boton.classList.add("text-primary");
                boton.setAttribute("style", "background-color: white; border: none;");

                const solicitudIcon = document.createElement("span");
                solicitudIcon.textContent = "📄";

                boton.appendChild(solicitudIcon);
                boton.appendChild(document.createTextNode(` ${element.id}`));
                div.appendChild(boton);
                solicitudCell.appendChild(div);
                row.appendChild(solicitudCell);

                // Agregar evento click al botón de solicitud
                boton.addEventListener("click", () => {
                    insertarNumSeguimiento(element);
                    mostrarSeguimiento(element.detalle, element);
                });

                crearFilaExpediente(element, "TipoDocumento", { documento: true }, "Documento");
                crearFilaExpediente(element, "Asunto");
                crearFilaExpediente(element, "Fecha");
                crearFilaExpediente(element, "Unidades");
                crearFilaExpediente(element, "Expediente", { div: true });
                crearFilaExpediente(element, "EstadoTramite", { colores: true });
                crearFilaExpediente(element, "FechaModificacion");

                // Campo de "url" con icono de descarga
                const docCell = document.createElement("td");
                const docLink = document.createElement("a");
                if (element.archivo && element.archivo.length > 0) {
                    docLink.href = element.archivo[0].url;
                    const downloadIcon = document.createElement("span");
                    downloadIcon.textContent = "⬇️";
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
    };

    const insertarNumSeguimiento = (data) => {
        const numSolicitud = document.querySelector("#id_num_solicitud");
        numSolicitud.textContent = `${data.id.toString()}`;
    }

    const mostrarSeguimiento = (detalles, element) => {
        const tbodyDetalles = document.querySelector("#tabla-seguimiento-one tbody");

        tbodyDetalles.innerHTML = "";

        const buildTree = (nodes, parentId = 0, level = 0) => {

            nodes
                .filter(node => node.IdPadre === parentId)
                .forEach(node => {
                    const row = document.createElement("tr");
                    row.style.fontSize = "14px";
                    row.classList.add("treegrid-" + node.IdEscDet);

                    if (parentId !== 0) {
                        row.classList.add("treegrid-parent-" + parentId);
                    }

                    const createCell = (text, style = {}) => {
                        const cell = document.createElement("td");
                        cell.textContent = text;
                        for (let key in style) {
                            cell.style[key] = style[key];
                        }
                        return cell;
                    };

                    const createExpandButton = (nodeId) => {
                        const btn = document.createElement("button");
                        btn.classList.add("expand-btn");
                        btn.style.border = "none";
                        btn.style.background = "none";
                        btn.style.color = "white";
                        btn.textContent = "▼";
                        btn.addEventListener("click", () => {
                            const childRows = document.querySelectorAll(`.treegrid-parent-${nodeId}`);
                            childRows.forEach(row => {
                                if (row.style.display === "none") {
                                    row.style.display = "table-row";
                                    btn.textContent = "▼";
                                } else {
                                    row.style.display = "none";
                                    btn.textContent = "▶";
                                    hideAllChildren(row);
                                }
                            });
                        });
                        return btn;
                    };

                    const hideAllChildren = (row) => {
                        const nodeId = row.classList[0].split('-')[1];
                        const childRows = document.querySelectorAll(`.treegrid-parent-${nodeId}`);
                        childRows.forEach(childRow => {
                            childRow.style.display = "none";
                            hideAllChildren(childRow);
                        });
                    };

                    const firstCell = createCell("");
                    if (nodes.some(n => n.IdPadre === node.IdEscDet)) {
                        const div = document.createElement("div");
                        div.style.display = "flex";
                        div.style.alignItems = "center";
                        div.style.marginLeft = `${level * 20}px`;

                        const expandButton = createExpandButton(node.IdEscDet);
                        div.appendChild(expandButton);
                        div.appendChild(document.createTextNode(node.IdUnidRem));
                        firstCell.appendChild(div);
                    } else {
                        const div = document.createElement("div");
                        div.style.marginLeft = `${level * 20}px`;
                        div.textContent = node.IdUnidRem;
                        firstCell.appendChild(div);
                    }

                    row.appendChild(firstCell);

                    row.appendChild(createCell(node.Asunto));
                    row.appendChild(createCell(node.IdUnidDes));
                    row.appendChild(createCell(node.Respuesta));

                    const celdaEstado = document.createElement("td");
                    const colorEstado = applyEstadoColor(node.Estado);
                    crearDivColoreado(colorEstado, node.Estado, celdaEstado);
                    row.appendChild(celdaEstado);

                    //row.appendChild(createCell(node.Estado, { backgroundColor: applyEstadoColor(node.Estado), color: "white" })); 

                    //CAMPO OBSERVACIÓN-------------------------
                    if (node.Estado === "Observado") {
                        const celdaObservación = document.createElement("td");

                        const div = document.createElement("div");
                        div.style.cursor = "pointer";
                        div.title = "Detalles";

                        const boton = document.createElement("button");
                        boton.classList.add("text-primary");
                        boton.setAttribute("style", "background: none; border: none;");

                        const solicitudIcon = document.createElement("span");
                        solicitudIcon.textContent = "🔍";

                        boton.appendChild(solicitudIcon);
                        boton.appendChild(document.createTextNode(`Observación a detalle`));
                        div.appendChild(boton);
                        celdaObservación.appendChild(div);
                        row.appendChild(celdaObservación);

                        boton.addEventListener("click", () => {
                            insertarDocumentoSubsanado(node, element);
                            observacionADetalle(node, element);
                        });
                    } else {
                        row.appendChild(createCell(node.Observacion));
                    }

                    tbodyDetalles.appendChild(row);

                    buildTree(nodes, node.IdEscDet, level + 1);
                });
        };

        buildTree(detalles);

        let modalSeguimiento = document.querySelector("#tabla-seguimiento-one");
        modalSeguimiento.showModal();
    };

    /* ----------------------------------- Seguimiento a Detalle ----------------------------------- */
    const detalleSeguimiento = document.querySelector("#id_detalle_seguimiento");
    const btncerrarDetalleSeguimiento = document.querySelector("#btn-cerrar-detalle-seguimiento");
    const campoSubsanar = document.querySelector("#id_campo_subsanar");

    const fieldFechaDerivacion = document.querySelector("#id_Fecha_Derivacion");
    //const fieldFechaRecepcion = document.querySelector("#id_Fecha_Recepcion");
    const fieldUnidadRemitente = document.querySelector("#id_Unidad_Remitente");
    const fieldUnidadDestino = document.querySelector("#id_Unidad_Destino");
    const fieldAsunto = document.querySelector("#id_Asunto");
    const fieldRespuesta = document.querySelector("#id_Respuesta");
    const fieldObservacion = document.querySelector("#id_Observación");

    btncerrarDetalleSeguimiento.addEventListener("click", () => {
        detalleSeguimiento.close();
        fieldFechaDerivacion.textContent = "";
        //fieldFechaRecepcion.textContent = "";
        fieldUnidadRemitente.textContent = "";
        fieldUnidadDestino.textContent = "";
        fieldAsunto.textContent = "";
        fieldRespuesta.textContent = "";
        fieldObservacion.textContent = "";
        campoSubsanar.style.display = "none";
    });

    let idExpedienteSubsanado = 0;

    const observacionADetalle = (node, element) => {
        fieldFechaDerivacion.textContent = node.FechaRegistro;
        //fieldFechaRecepcion.textContent = "";
        fieldUnidadRemitente.textContent = node.IdUnidRem;
        fieldUnidadDestino.textContent = node.IdUnidDes;
        fieldAsunto.textContent = node.Asunto;
        fieldRespuesta.textContent = node.Respuesta;
        fieldObservacion.textContent = node.Observacion;

        campoSubsanar.style.display = "block";

        detalleSeguimiento.showModal();

        const form = document.querySelector("#form");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            submitSubsanacion(node, element);
        });
    }

    const submitSubsanacion = async (node, element) => {

        //---------------------------FETCH SUBSANAR----------------------- 

        loadingSubsanar.showModal();

        const urlSubsanar = "http://munisayan.gob.pe/tramite/api/Resp";

        const formData = new FormData();

        const archivo = fileInput.files[0];
        formData.append("archivo", archivo);

        const idAnexoElement = document.querySelector("#id_anexo_subsanar");
        const anexoValue = idAnexoElement ? idAnexoElement.value : "";
        const idTipoDocumento = document.querySelector("#id_tipoDocumento_subsanar");
        const tipoDocumentoValue = idTipoDocumento ? idTipoDocumento.value : "";
        const idDocumento = document.querySelector("#id_documento_subsanar");
        const documentoValue = idDocumento ? idDocumento.value : "";

        const body = [
            {
                "Id": idExpedienteSubsanado,
                "IdCabecera": element.IdEscCab,
                "IdDetalle": node.IdEscDet,
                "TipoDocumento": tipoDocumentoValue,
                "Documento": documentoValue,
                "Respuesta": document.querySelector("#id_respuesta_subsanar").value,
                "urlAnexo": anexoValue
            }
        ]

        formData.append("body", JSON.stringify(body));

        console.log(JSON.stringify(body));


        const res = await fetch(urlSubsanar, {
            method: "POST",
            body: formData
        }).then(res => {

            loadingSubsanar.close()

            if (res.status === 200) {
                const msg = "• Has enviado tu subsanación";
                createMensajeSuccess(msg);
                modalSuccess.showModal();
                return res.json().then(respuesta => {
                    idExpedienteSubsanado = respuesta.ids[0];
                })
            } else if (res.status === 500) {
                return res.json().then(respuesta => {
                    console.error(`Estado: ${res.status}`);
                    const msgerr = "• " + respuesta.Error;
                    createErrors(msgerr);
                    modal.showModal();
                })
            } else if (res.status === 400) {
                return res.json().then(respuesta => {
                    console.error(`Estado: ${res.status}`);
                    const msgerr = "• " + respuesta.Error;
                    createErrors(msgerr);
                    modal.showModal();
                })
            }

        }).catch(error => {
            createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
            modal.showModal();
            console.error(error);
        })

        insertarDocumentoSubsanado(node, element);
    }

    const insertarDocumentoSubsanado = async (node, element) => {

        // Function to extract the desired part of NombreArchivo
        function getNombreArchivoPart(nombreArchivo) {
            const parts = nombreArchivo.split("-");
            if (parts.length >= 3) {
                return parts.slice(2).join("-");
            }
            return "";
        }

        const urlAnexoSubsanado = document.querySelector("#id_anexo_subsanar");
        const tipoDocumentoSubsanado = document.querySelector("#id_tipoDocumento_subsanar");
        const documentoSubsanado = document.querySelector("#id_documento_subsanar");
        const respuestaSubsanado = document.querySelector("#id_respuesta_subsanar");

        const url = `https://munisayan.gob.pe/tramite/api/TdListadoResp?Detalle=${node.IdEscDet}&Cabecera=${element.IdEscCab}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(respuesta => {

                        document.querySelector("#nombre_archivo").textContent = "";

                        if (respuesta[0].id) {
                            const nombreArchivo = respuesta[0].NombreArchivo;
                            const nombreArchivoPart = getNombreArchivoPart(nombreArchivo);

                            // Update the hidden input field
                            document.getElementById("nombre_archivo").textContent = nombreArchivoPart;
                            document.getElementById("nombre_archivo_mostrado").style.display = "block";
                        } else {
                            document.getElementById("nombre_archivo_mostrado").style.display = "none";
                        }

                        urlAnexoSubsanado.value = respuesta[0].urlAnexo;
                        tipoDocumentoSubsanado.value = respuesta[0].TipoDocumento;
                        documentoSubsanado.value = respuesta[0].Documento;
                        respuestaSubsanado.value = respuesta[0].Respuesta;

                        idExpedienteSubsanado = respuesta[0].id;
                    })
                }
            })
            .catch(error => {
                divErrores.innerHTML = "";
                createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
                modal.showModal();
                console.error(error);
            })
    }

    const btnCerrarTablaSeguimiento = document.querySelector("#btn-cerrar-tabla-seguimiento-one");
    btnCerrarTablaSeguimiento.addEventListener("click", () => {
        let modalSeguimiento = document.querySelector("#tabla-seguimiento-one");
        modalSeguimiento.close();
    });

    const filterData = (data) => {
        const filterValue = filterDate.value;
        const searchValue = searchSolicitud.value.toLowerCase();
        let filteredData = data;

        if (filterValue === "7" || filterValue === "30") {
            const days = parseInt(filterValue);
            const now = new Date();
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                const diffTime = Math.abs(now - itemDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= days;
            });
        } else if (filterValue === "month") {
            const now = new Date();
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            });
        } else if (filterValue === "range") {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                return itemDate >= start && itemDate <= end;
            });
        }

        if (searchValue) {
            filteredData = filteredData.filter(item => {
                const solicitud = item.id.toString().toLowerCase();
                const expediente = item.Expediente ? item.Expediente.toLowerCase() : "";
                return solicitud.includes(searchValue) || expediente.includes(searchValue);
            });
        }

        return filteredData;
    };

    const applyFilters = () => {
        const filteredData = filterData(tramitesData);
        renderTable(filteredData);
    };

    btnRefresh.addEventListener("click", () => {
        loading.style.display = "block";
        misTramites.style.display = "none";
        fetchData();
    });

    filterDate.addEventListener("change", () => {
        const filterValue = filterDate.value;
        if (filterValue === "range") {
            dateRangeInputs.style.display = "block";
        } else {
            dateRangeInputs.style.display = "none";
        }
        applyFilters();
    });

    searchSolicitud.addEventListener("input", () => { applyFilters(); });

    startDate.addEventListener("change", () => { applyFilters(); });

    endDate.addEventListener("change", () => { applyFilters(); });

    loading.style.display = "block";
    misTramites.style.display = "none";

    await fetchData();
    applyFilters();

    /* ---------------------------FETCH SUBSANAR----------------------- */

    // Validación del archivo cargado
    const fileInput = document.getElementById("id_archivo_subsanar");
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

});


