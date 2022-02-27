function download(content, fileName, contentType) { //nalaganje json datoteke in kreiranje drevesa po tej datoteki
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "data.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function saveJson(content) { //shranjevanje
    download(content, 'json.txt', 'text/plain');
}

function saveTree() { //na html strani kličem to funkcijo, ki shrani json datoteko na računalnik 
    saveJson(treeJson());
}

function loadJson(content) { //prikaz drevesa na html strani
    document.getElementById('jsonView').innerHTML = content;
}

function loadTree() { //na html strani kličem to funkcijo za nalaganje json datoteke
    var file = document.getElementById('file').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = (event) => {
            loadJson(event.target.result);
            createTreeFromJson(textAreaContent());
        }
        reader.onerror = (event) => {
            alert(event.target.error);
        }
        reader.readAsText(file, 'utf-8');
    }
}

function printTree() { //naprinta drevo iz JSON fileja
    document.getElementById("jsonView").innerHTML = JSON.stringify(treeJson(), null, 2);
}

function resetTree() { //izprazni drevo
    document.getElementById("TreeView").innerHTML = '';
    return appendNode(); //vrne prazen prvotni 'root'
}

function appendNode(elm) { //riše vozlišče korena, oz riše podvozlišča ko kliknemo na gumb add
    if (!elm) elm = document.getElementById("TreeView");
    else elm = elm.closest('ul');
    var appended = document.querySelector('#templateTreeNode').children[0].cloneNode(true);
    elm.appendChild(appended);
    printTree();
    return appended;
}

function removeNode(button) { //odstrani vozlišče
    var elm = button.closest("ul");
    if (elm.parentNode.id == 'TreeView') {
        resetTree();
    } else {
        elm.parentNode.removeChild(elm);
    }
    printTree();
}

/* function graf(el) {
    let koristnost = el.parentNode.querySelector(".koristnost").value;
    window.open('graf.html?' + koristnost, 'Graf', 'popup, left=100, top=100, width=600, height=400');
} */

function calcDOM(el) {
    let opis = el.querySelector(".opis").value;
    let koristnost = el.querySelector(".koristnost").value;
    let utez = el.querySelector(".utez").value;
    let najugodnejsa = el.querySelector(".najugodnejsa").value;
    let najmanj = el.querySelector(".najmanj").value;
    let x = el.querySelector(".alternativa").value;
    let rezultatEl = el.querySelector(".rezultat");

    let vozlisceUl = el.parentNode;
    let podvozlisce = vozlisceUl.children;
    let total = 0;
    let hasChildren = false;
    for (let i = 0; i < podvozlisce.length; i++) {
        if (podvozlisce[i].nodeName == 'UL') {
            let li = podvozlisce[i].querySelector('.podvozlisce');
            total += utez * calcDOM(li);
            hasChildren = true;
        }
    }
    if (!hasChildren) {
        let rezultat;
        switch (koristnost) {
            case "k*x+n":
                let k = 1 / (najugodnejsa - najmanj);
                let n = 1 - (k * najugodnejsa);
                rezultat = k + "*x+" + n;
                rezultatEl.innerHTML = eval(rezultat);
                return utez * eval(rezultat);
            case "Math.pow(x, 2)":
                rezultat = "Math.pow(x, 2)";
                rezultatEl.innerHTML = eval(rezultat);
                return utez * eval(rezultat);
            case "Math.exp(-(x-min))":
                rezultat = "Math.exp(-(x-" + najmanj + "))";
                rezultatEl.innerHTML = eval(rezultat);
                return utez * eval(rezultat);
            case "1-Math.exp(-(x-min))":
                rezultat = "1-Math.exp(-(x-" + najmanj + "))";
                rezultatEl.innerHTML = eval(rezultat);
                return utez * eval(rezultat);

        }

    } else {
        rezultatEl.innerHTML = total;
        return total;
    }
}

function textAreaContent() {
    return JSON.parse(document.getElementById("jsonView").innerHTML);
}

function getListOfAlternatices(select) { //v dropdown box vnese seznam alternativ
    while (select.options.length > 0) {
        select.remove(0);
    }
    let telo = document.getElementById('tabela').tBodies[0];
    for (let j = 0; j < telo.rows.length; j++) {
        let opt = telo.rows[j].cells[0].children[0].value;
        let newOption = new Option(opt, j + 1);
        select.add(newOption, undefined);
    }
}

function calcAlternative() {
    let j = parseInt(document.getElementById('pickAlternative').value);
    let vseVrednosti = pridobitevPodatkov();
    let tree = treeJson();
    setAlternative(tree, function getAlternative(opis) { //klic funkcije
        for (let i = 0; i < vseVrednosti[0].length; i++) {
            if (opis == vseVrednosti[0][i])
                return vseVrednosti[j][i];
        }
        return 0;
    });
    let total = calc(tree);
    document.getElementById("jsonView").innerHTML = JSON.stringify(tree, null, 2);
    createTreeFromJson(tree);
    calcDOM(treeRoot());
}

function setAlternative(tree, alternativeValue) {
    if (tree.hasChildren()) {
        tree.children.forEach(child => {
            setAlternative(child, alternativeValue);
        });
    } else {
        tree.alternativa = alternativeValue(tree.opis);
    }
}