function treeRoot() { //prejme podvozlisce
    return document.getElementById("TreeView").querySelector('.podvozlisce');
}

function treeElement(el) { //išče vrednosti znotraj seznama oz. lista
    this.opis = el.querySelector(".opis").value;
    this.koristnost = el.querySelector(".koristnost").value;
    this.utez = el.querySelector(".utez").value;
    this.najugodnejsa = el.querySelector(".najugodnejsa").value;
    this.najmanj = el.querySelector(".najmanj").value;
    createTreeFromJson
    this.alternativa = el.querySelector(".alternativa").value;
    this.children = [];
    this.hasChildren = function() {
        return this.children.length;
    }

    let vozlisceUl = el.parentNode; //iz li gre v ul
    let podvozlisce = vozlisceUl.children; //znotraj ul isce li
    for (let i = 0; i < podvozlisce.length; i++) { //se sprehaja po vseh elementih znotraj ulja (li in ul-ji)
        if (podvozlisce[i].nodeName == 'UL') { //li izpustimo, ker predstavlja vozlisce
            let li = podvozlisce[i].querySelector('.podvozlisce');
            this.children.push(new treeElement(li)); //rekurzivni klic, v polje children dodajamo 'otroke' oz podvozlisce nekega vozlisca
        }
    }
}

function copyJson2DOM(jsonElement, domElement) { //jsonElement - content iz JSON-a, domElement - element iz resetenega drevesa (tisti appendNode, elementi vozlisca)
    domElement.querySelector(".opis").value = jsonElement.opis;
    domElement.querySelector(".koristnost").value = jsonElement.koristnost;
    domElement.querySelector(".utez").value = jsonElement.utez;
    domElement.querySelector(".najugodnejsa").value = jsonElement.najugodnejsa;
    domElement.querySelector(".najmanj").value = jsonElement.najmanj;
    domElement.querySelector(".alternativa").value = jsonElement.alternativa;
}

function treeJson() { //drevo iz JSON-a
    return new treeElement(treeRoot()); //elemente iz podvozlišča 
}

function _createDomFromJson(content, domNode) { //nariše drevo iz JSON-a
    copyJson2DOM(content, domNode);
    content.children.forEach(child => {
        var domChild = appendNode(domNode);
        _createDomFromJson(child, domChild)
    });
}

function createTreeFromJson(content) { //ustvari drevo iz JSON-a (najprej izbrise, nato ustvari)
    var domNode = resetTree();
    _createDomFromJson(content, domNode);
}

function calc(node) { //izracuni znotraj drevesa
    if (node.hasChildren()) { //če ima vozlišče otroka
        let total = 0;
        node.children.forEach(child => {
            total += node.utez * calc(child); //rekurzivni klic
        });
        return total;
    } else {
        let x = node.alternativa;
        let rezultat;
        switch (node.koristnost) {
            case "k*x+n":
                let k = 1 / (node.najugodnejsa - node.najmanj);
                let n = 1 - (k * node.najugodnejsa);
                rezultat = k + "*x+" + n;
                return node.utez * eval(rezultat);
            case "Math.pow(x, 2)":
                rezultat = "Math.pow(x, 2)";
                return node.utez * eval(rezultat);
            case "Math.exp(-(x-min))":
                rezultat = "Math.exp(-(x-" + node.najmanj + "))";
                return node.utez * eval(rezultat);
            case "1-Math.exp(-(x-min))":
                rezultat = "1-Math.exp(-(x-" + node.najmanj + "))";
                return node.utez * eval(rezultat);
        }
    }
}