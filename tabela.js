let stA = 3;

function izrisiTabelo() {
    let tble = document.getElementById('tabela');
    if (tble.rows[0].cells.length == 1) {
        _izrisiTabelo(treeJson());
        dodajOceno();
    } else {
        let row = tble.rows;
        for (let i = 0; i < row.length; i++) {
            let dolzina = row[i].cells.length;
            for (let j = 0; j < dolzina - 1; j++)
                row[i].deleteCell(-1);
        }
        _izrisiTabelo(treeJson());
        dodajOceno();
    }
}

function _izrisiTabelo(tree) {

    tree.children.forEach(element => {
        _izrisiTabelo(element);

    });
    if (!tree.hasChildren()) {
        dodajKolono(tree.opis);
    }
}

function dodajKolono(st) { //pri izpisu podatkov iz tabele
    let glava = document.getElementById('tabela').tHead;
    for (let h = 0; h < glava.rows.length; h++) {
        let th = document.createElement('th');
        glava.rows[h].appendChild(th);
        th.innerHTML = st;
    }

    let telo = document.getElementById('tabela').tBodies[0];
    for (let i = 0; i < telo.rows.length; i++) {
        let newCell = telo.rows[i].insertCell(-1);
        newCell.innerHTML = `<input type="text">`;
    }
}

function dodajOceno() { //zadnji stolpec v tabeli
    let glava = document.getElementById('tabela').tHead;
    let th = document.createElement('th');
    glava.rows[0].appendChild(th);
    th.innerHTML = `Ocene`;

    let telo = document.getElementById('tabela').tBodies[0];
    for (let i = 0; i < telo.rows.length; i++) {
        let newCell = telo.rows[i].insertCell(-1);
        newCell.innerHTML = "";
    }
}

function dodajVrstico() { //doda vrstico/alternativo v tabelo
    let table = document.getElementById("tabela");
    let row = table.insertRow();
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        if (i == 0) {
            let cell = row.insertCell();
            cell.innerHTML = `<input type="text" value="Alternativa ` + stA + `">`;
            stA++;
        } else {
            let cell = row.insertCell();
            cell.innerHTML = `<input type="text">`;
        }
    }
    if (table.rows[0].cells[table.rows[0].cells.length - 1].innerHTML == "Ocene") {
        table.rows[table.rows.length - 1].deleteCell(-1);
        let cell = row.insertCell();
        cell.innerHTML = "";
    }
}

function pridobitevPodatkov() { //iz tabele dobi podatke v obliki dvodimenzionalnega polja
    let tabela = document.getElementById('tabela');
    let vseVrednosti = [];

    for (let i = 0; i < tabela.rows.length; i++) {
        let vrednost = [];
        let objCells = tabela.rows.item(i).cells;
        for (let j = 1; j < objCells.length - 1; j++) {
            if (objCells.length > 0) {
                let x = '';
                if (i == 0) {
                    x = tabela.rows[i].cells[j].innerHTML;
                } else {
                    x = tabela.rows[i].cells[j].childNodes[0].value;
                }
                vrednost.push(x);
            }
        }
        vseVrednosti.push(vrednost);
    }
    return vseVrednosti;
}

let opisiInOcene = [];

let opisi = [];
let ocene = [];

function izracunAlternativ() { //izračun ocen v tabeli, zadnji stolpec
    let tble = document.getElementById('tabela');
    let telo = document.getElementById('tabela').tBodies[0];
    if (opisi != null && ocene != null) {
        for (let i = 0; i < telo.rows.length; i++) {
            let opis = tble.rows[i + 1].cells[tble.rows[0].cells.length - 1].style;
            opis.backgroundColor = "transparent";
            opisi.length = 0;
            ocene.length = 0;
        }
    }
    for (let i = 0; i < telo.rows.length; i++) {
        let opis = tble.rows[i + 1].cells[0].childNodes[0].value;
        opisi.push(opis);
    }
    let i = telo.rows[0].cells.length - 1;
    for (let j = 0; j <= telo.rows.length - 1; j++) {
        let total = izracunEneAlternative(j + 1); //+1 ker nas ne zanima prva vrstica
        telo.rows[j].cells[i].innerHTML = total;
        ocene.push(total);
    }
    opisiInOcene.push(opisi);
    opisiInOcene.push(ocene);
    console.log(opisiInOcene);

    let najboljsa = indexOfMax(ocene);
    for (let i = 0; i < telo.rows.length; i++) {
        if (i == najboljsa) {
            let opis = tble.rows[i + 1].cells[tble.rows[0].cells.length - 1].style;
            opis.backgroundColor = "green";
        }
    }
    ocene = [];
}

function indexOfMax(arr) { //max od vsot zmnožkov
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function izracunEneAlternative(j) {
    let vseVrednosti = pridobitevPodatkov(); //prejme polje kot dvodimenzionalno poljes
    let tree = treeJson(); //pokliče drevo
    setAlternative(tree, function getAlternative(opis) { //nastavimo v drevo naše izračune glede na alternativo
        for (let i = 0; i < vseVrednosti[0].length; i++) { //prvo polje znotraj dvodimenzionalnega polja vsebuje opise
            if (opis == vseVrednosti[0][i]) //da se parameter ujame z opisom iz drevesa in vrne vrednost alternative glede na parameter 
                return vseVrednosti[j][i];
        }
        return 0;
    });
    let total = calc(tree); //končna ocena se izracuna v calc, katero tudi vrne
    let n = total.toFixed(2);
    return n;
}

function grafocen() {
    var xArray = opisiInOcene[0];
    var yArray = opisiInOcene[1];

    var data = [{
        x: xArray,
        y: yArray,
        type: "bar"
    }];

    var layout = { title: "Graf primerjave vrednosti alternativ" };

    Plotly.newPlot("myPlot", data, layout);

    var divContents = document.getElementById("myPlot").innerHTML;
    var a = window.open('', '', 'left=100, top=100, width=800, height=600');
    a.document.write('<html>');
    a.document.write('<body > <h1>Graf primerjave vrednosti alternativ</h1> <p>Najboljša alternativa je ' + opisiInOcene[0][indexOfMax(opisiInOcene[1])] + '</p> <br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
}