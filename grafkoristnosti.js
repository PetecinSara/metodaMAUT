function graf(el) {

    let najugodnejsa = el.parentNode.querySelector(".najugodnejsa").value;
    let najslabsa = el.parentNode.querySelector(".najmanj").value;
    let koristnost = el.parentNode.querySelector(".koristnost").value;
    let rezultat;
    let xValues = [];
    let yValues = [];
    let x;
    console.log(najugodnejsa + " " + najslabsa);

    switch (koristnost) {
        case "k*x+n":
            xValues = [];
            yValues = [];
            let k = 1 / (najugodnejsa - najslabsa);
            let n = 1 - (k * najugodnejsa);
            rezultat = "(x-(" + n + "))/" + k;
            for (x = 0; x <= 1; x++) {
                xValues.push(eval(rezultat));
                yValues.push(x);
            }
            break;

            /* case "-(Math.log(x-z)*(-1/Math.log(min-z)))+1":
                xValues = [];
                yValues = [];
                let z = najugodnejsa - 1;
                let a = najslabsa - z;
                rezultat = "-(Math.log(x-" + z + ")*(-1/Math.log(" + a + ")))+1";
                let razlika = (najugodnejsa - najslabsa) / 10;
                let y = 0;
                for (let x = 0; x <= 10; x += razlika) {
                    xValues.push(eval(rezultat));
                    yValues.push(y);
                    y += 0.1;
                }
                break;
            case "Math.log10(x-z)*(1/Math.log10(max-z))":
                xValues = [];
                yValues = [];
                let z1 = najslabsa - 1;
                rezultat = "Math.log10(x-" + z1 + ")*(1/Math.log10(" + (najugodnejsa - z1) + "))";
                let razlika1 = (najugodnejsa - najslabsa) / 10;let x = 0
                let y1 = 0;
                for (let x = 0; x <= 10; x += razlika1) {
                    xValues.push(eval(rezultat));
                    yValues.push(y1);
                    y1 += 0.1;
                }
                break; */
            /* case "Math.pow(x, a)":
                if (parseInt(najugodnejsa) > parseInt(najslabsa)) {
                    yValues = [];
                    xValues = [];
                    //T1(0,min) T2(1,max)

                    let razlika2 = (najugodnejsa - najslabsa) / ;
                    rezultat = "Math.pow(x, 2)";
                    let y2 = parseInt(najslabsa);
                    for (x = 0; x <= 1; x += 0.1) {
                        xValues.push(y2);
                        yValues.push(eval(rezultat));
                        y2 = y2 + razlika2;
                    }
                    break;
                } else {
                    alert("Najugodnejša vrednost more biti večja od najmanj ugodne vrednosti!")
                    break;
                } */
        case "Math.exp(-(x-min))":
            if (parseInt(najugodnejsa) > parseInt(najslabsa)) {
                yValues = [];
                xValues = [];
                let razlika1 = (najugodnejsa - najslabsa) / 10;
                rezultat = "Math.exp(-(x-" + najslabsa + "))";
                for (x = parseInt(najslabsa); x <= najugodnejsa; x += razlika1) {
                    xValues.push(x);
                    yValues.push(eval(rezultat));
                }
                break;
            } else {
                alert("Najugodnejša vrednost more biti večja od najmanj ugodne vrednosti!")
                break;
            }

        case "1-Math.exp(-(x-min))":
            if (parseInt(najugodnejsa) > parseInt(najslabsa)) {
                yValues = [];
                xValues = [];
                let razlika2 = (najugodnejsa - najslabsa) / 10;
                rezultat = "1-Math.exp(-(x-" + najslabsa + "))";
                for (x = parseInt(najslabsa); x <= najugodnejsa; x += razlika2) {
                    xValues.push(x);
                    yValues.push(eval(rezultat));
                }
                break;
            } else {
                alert("Najugodnejša vrednost more biti večja od najmanj ugodne vrednosti!")
                break;
            }


    }
    console.log(xValues);
    console.log(yValues);

    // Display using Plotly
    let data = [{ x: xValues, y: yValues, mode: "lines" }];
    let layout = {
        title: "y = " + koristnost
    };

    Plotly.newPlot("grafkoristnosti", data, layout);

    var divContents = document.getElementById("grafkoristnosti").innerHTML;
    var a = window.open('', '', 'left=100, top=100, width=800, height=600');
    a.document.write('<html>');
    a.document.write('<body > <h1>Graf funkcije koristnosti: f(x)=' + koristnost + '</h1><br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
}