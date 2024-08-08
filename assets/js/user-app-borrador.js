document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const loadingDiv = document.getElementById("loading");
    const all = document.getElementById("all");

    async function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const formObject = {};

        for (const [key, value] of formData) {
            formObject[key] = key === 'documento' ? +value : value;

            if(value instanceof File){
                const fileBytes = await readFile(value);
                formObject[key] = fileBytes;

            }else{
                formObject[key] = value;
            }
        }

        const url = "https://munisayan.gob.pe/tramite/api/user";

        loadingDiv.style.display = 'block';

        console.log(JSON.stringify(formObject));

        /* const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
            })
            .then((response) => {
                if (response.ok) {
                    console.log("datos enviados");
                } else if (response.status === 400) {
                    console.log(response.body);
                }
                return response.json();
            })
            .then(data => {
                if (data.errors && data.errors.length > 0 && data.errors[0].msg) {
                    console.log("Datos incorrectos:", data.errors[0].msg);
                }else if (data.msg) {
                    console.log("Datos incorrectos:", data.msg);
                }
                
                loadingDiv.style.display = 'none';
                //window.location.href = 'info_activacion.html';
            }); */
        /* .catch((error) => {
            console.error("Error al enviar los datos:", error);
            loadingDiv.style.display = 'none';
            // Aquí puedes agregar código para manejar el error si es necesario
        }) */;
    });
});
