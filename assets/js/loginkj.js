function validarCredenciales(username, password) {
    return new Promise(function (resolve, reject) {
        ApiLogeo(username, password)
            .done(function (response) {
                var data = response;
                if (data === null) {
                    $(".contenedorL").hide();
                    $(".contenedorM").show();
                    setTimeout(function () {
                        $(".contenedorM").hide();
                    }, 3000);
                    resolve(0);
                } else {
                    if (data.length == 1) {
                        if (data[0]["contrib"] !== "") {
                            if (data[0]["contrib"] === null) {
                                var errorMessage = $('#error-message');
                                errorMessage.text(data[0]["mensaje"]);
                                errorMessage.css({
                                    'color': 'red',
                                    'text-align': 'center',
                                    'font-weight': 'bold'
                                }).fadeIn();
                                errorMessage.delay(6000).fadeOut();
                                $(".contenedorL").hide();
                                $(".contenedorM").show();
                                setTimeout(function () {
                                    $(".contenedorM").hide();
                                }, 3000);
                                resolve(0)
                            } else {
                                localStorage.setItem("Codigo", data[0]["contrib"].toString().trim());
                                localStorage.setItem("Session", "true");
                                localStorage.setItem("RutaApi", RutaApi);
                                localStorage.setItem("MasUno", "false")
                                $(".contenedorL").hide();
                                resolve(1)
                            }
                        }
                    } else if (data.length > 1) {
                        localStorage.setItem("Data", JSON.stringify(data));
                        localStorage.setItem("Session", "true");
                        localStorage.setItem("RutaApi", RutaApi);
                        $(".contenedorL").hide();
                        resolve(2);
                    } else {
                        $(".contenedorL").hide();
                        $(".contenedorM").show();
                        setTimeout(function () {
                            $(".contenedorM").hide();
                        }, 3000);
                        resolve(0);
                    }
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $(".contenedorL").hide();
                reject(new Error("Error al realizar la consulta" + jqXHR));
            });
    });
}

function ApiLogeo(username, password) {
    return $.ajax({
        url: RutaApi + "Logeo?Documento=" + username + "&Password=" + encriptar(password),
        method: "GET",
        dataType: "json",
        success: function (response) {
        },
        error:function (xhr, status, error) {
            throw new Error(xhr.responseJSON.mensaje);
        }
    });
}