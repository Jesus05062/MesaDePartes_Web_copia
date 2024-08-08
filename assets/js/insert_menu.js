function loadMenuContent() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("desplegable").innerHTML = this.responseText;
        }
    }
    xhr.open("GET", "assets/resources/menu.html", true );
    xhr.send();
}

loadMenuContent();