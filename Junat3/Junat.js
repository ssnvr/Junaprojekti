//Aarni ja Sara
document.getElementById("nappi").addEventListener("click", fromWhere);
var xhr = new XMLHttpRequest();
var lähtökaupunkiAvain
var kohdekaupunkiAvain;
var kaupunkitaulukko =

    {
        helsinki: "HKI", turku: "TKU", lahti: "LH", jyväskylä: "JY", lappeenranta: "LR", joensuu: "JNS", kuopio: "KUO", vaasa: "VS"
    };


function fromWhere() {

    document.getElementById("fr").innerHTML = document.getElementById("fromwhere").value;
    document.getElementById("t").innerHTML = document.getElementById("towhere").value;

    lähtökaupunkiAvain = document.getElementById("fromwhere").value.toLowerCase();
    console.log(lähtökaupunkiAvain);
    //var lähtökaupunkiAvainPienellä = lähtökaupunkiAvain.toLowerCase();



    kohdekaupunkiAvain = document.getElementById("towhere").value.toLowerCase();
    console.log(kohdekaupunkiAvain);

    var lähtökaupunki = kaupunkitaulukko[lähtökaupunkiAvain];
    var kohdekaupunki = kaupunkitaulukko[kohdekaupunkiAvain];

    console.log(lähtökaupunki);
    console.log(kohdekaupunki);
    var mista = "https:///rata.digitraffic.fi//api/v1//live-trains//station/" + lähtökaupunki + "//" + kohdekaupunki;
    //console.log(lähtökaupunkiAvainPienellä);

    xhr.open("GET", mista);
    xhr.onreadystatechange = valmis;
    xhr.send();

    function valmis() {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            var laskuri = 1;
            var junantyyppi;
            var taulukko = JSON.parse(xhr.responseText);
            for (i in taulukko) {
                console.log(i);
                //if (taulukko[i].trainCategory === "Long-distance") {
                //    junantyyppi = "kaukojuna";
                //}
                //else {
                //    junantyyppi = "lähijuna";
                //}

                document.getElementById("lista").innerHTML += "<ol>" + laskuri + ". Junan vuoronumero: " + taulukko[i].trainNumber + " " + taulukko[i].trainType + ", junan tyyppi: " + taulukko[i].trainCategory + ", lähtöaika: " + new Date(taulukko[i].timeTableRows[i].scheduledTime).toLocaleTimeString() + ", saapumisaika: " + new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime).toLocaleTimeString();
                laskuri++;
                function oikeaIndeksi() {
                    for (j in taulukko[i].timeTableRows) {
                        if (taulukko[i].timeTableRows[j].stationShortCode === kohdekaupunki) {
                            return j;
                        }
                    }
                }


            }
        }

    }
}

