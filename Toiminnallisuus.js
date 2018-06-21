//Aarni ja Sara

document.getElementById("nappi").addEventListener("click", fromWhere);
document.getElementById("switch").addEventListener("click", muuta);
var xhr = new XMLHttpRequest();
var url;
var lähtökaupunki;
var kohdekaupunki;
var junantyyppi;
var laituri;
var peruutusteksti;
var pvm;
var lähtöaika;
var saapumisaika;
var eipysähdy = "";
var erotus;

$.getJSON("https://rata.digitraffic.fi/api/v1/metadata/stations", function (data) { //haetaan henkilöliikennekäytössä olevat asemat ()
    for (var i = 0; i < data.length; i++) {
        if (data[i].passengerTraffic === true) {
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit1");
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit2");
        }
    }
});

function muuta() {                          //vaihdetaan lähtö- ja kohdekaupungit päittäin
    var alkup = kaupungit1.value
    kaupungit1.value = kaupungit2.value;
    kaupungit2.value = alkup;
}

function fromWhere() {                      //varsinainen "pääfunktio"

    document.getElementById("lista").innerHTML = "";        //haetaan kaupungit 
    lähtökaupunki = kaupungit1.value;
    kohdekaupunki = kaupungit2.value;

    pvm = $("#kalenteri").val(); // pvm-muuttujalle Date-tyyppinen arvo kalenterista
    console.log(pvm);
    console.log(lähtökaupunki);
    console.log(kohdekaupunki);
    if (pvm === "" || pvm === null) { // Jos päivämäärää ei ole valittu (pvm joko "" tai null) haku näyttää seuraavat junat lähtö- ja kohdekaupunkien välillä
        url = "https:///rata.digitraffic.fi//api/v1//live-trains//station/" + lähtökaupunki + "//" + kohdekaupunki;
    }
    else { // -> päivämäärä valittu, haku sen päivän junavuoroista
        url = "https:///rata.digitraffic.fi//api/v1//live-trains//station/" + lähtökaupunki + "//" + kohdekaupunki + "?departure_date=" + pvm;
    }
    xhr.open("GET", url);
    xhr.onreadystatechange = valmis;
    xhr.send();

    function valmis() {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            if (xhr.responseText.includes("TRAIN_NOT_FOUND")) {         //Mikäli suoraa junayhteyttä ei ole
                alert("Hakemiesi asemien välillä ei ole suoraa junayhteyttä");
            }
            var taulukko = JSON.parse(xhr.responseText); //parsitaan URL:sta tuleva JSON-teksti taulukoksi.
            for (i in taulukko) { //taulukon läpikäynti

                lähtöaika = new Date(taulukko[i].timeTableRows[0].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).bold(); //lähtö- ja saapumisajat paikalliseen formaattiin ja "00:00"-muotoon boldattuna.
                saapumisaika = new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).bold();
                erotus = new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime) - new Date(taulukko[i].timeTableRows[0].scheduledTime);

                function msToTime(duration) {                                   // Muunnetaan lähtöajan ja saapumisajan välinen erotus (millisekunneissa) tunniksi ja minuuteiksi
                    var milliseconds = parseInt((duration % 1000) / 100),    
                        seconds = parseInt((duration / 1000) % 60),
                        minutes = parseInt((duration / (1000 * 60)) % 60),
                        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

                    hours = (hours < 10) ? "0" + hours : hours;
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;

                    return hours + ":" + minutes + "h";
                }

                if (taulukko[i].trainCategory === "Long-distance") {
                    junantyyppi = "kaukojuna";
                }
                if (taulukko[i].trainCategory === "Commuter") {
                    junantyyppi = "lähijuna";
                }
                if (taulukko[i].trainCategory === "Cargo") {
                    junantyyppi = "tavarajuna";
                }
                if (taulukko[i].timeTableRows[0].commercialTrack === "") {
                    laituri = "ei tiedossa";
                }
                else {
                    laituri = taulukko[i].timeTableRows[0].commercialTrack;
                }
                if (taulukko[i].timeTableRows[i].cancelled === "true") {
                    peruutusteksti = "VUORO PERUTTU! Terveisin VR :D ";
                }
                else {
                    peruutusteksti = "";
                }
                //for (j in taulukko[i].timeTableRows) {
                //    if (taulukko[i].timeTableRows[j].stationShortCode === kohdekaupunki && taulukko[i].timeTableRows[j].trainStopping === false) {
                //        eipysähdy = " HUOM! Juna ei pysähdy tällä asemalla";
                //    }
                //}

                document.getElementById("lista").innerHTML += "<ol>" + peruutusteksti + "Junavuoro: " + taulukko[i].trainNumber + " " + taulukko[i].trainType + " (" + junantyyppi + "),  lähtöaika: " + lähtöaika + ", saapumisaika: " + saapumisaika + eipysähdy + ", lähtölaituri: " + laituri + ", kesto: " + msToTime(erotus);
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


/*

//Aarni ja Sara
document.getElementById("nappi").addEventListener("click", fromWhere);
document.getElementById("switch").addEventListener("click", muuta);
var xhr = new XMLHttpRequest();
var url;
var lähtökaupunki;
var kohdekaupunki;

$.getJSON("https://rata.digitraffic.fi/api/v1/metadata/stations", function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].passengerTraffic === true) {
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit1");
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit2");
        }
    }
});
function muuta() {
    var alkup = kaupungit1.value
    kaupungit1.value = kaupungit2.value;
    kaupungit2.value = alkup;
}
function fromWhere() {

    document.getElementById("lista").innerHTML = "";
    lähtökaupunki = kaupungit1.value;
    kohdekaupunki = kaupungit2.value;
    var pvm;

    pvm = $("#kalenteri").val();
    console.log(pvm);
    console.log(lähtökaupunki);
    console.log(kohdekaupunki);
    if (pvm == "" || pvm == null) {
        url = "https:///rata.digitraffic.fi//api/v1//live-trains//station/" + lähtökaupunki + "//" + kohdekaupunki;
    }
    else {
        url = "https:///rata.digitraffic.fi//api/v1//live-trains//station/" + lähtökaupunki + "//" + kohdekaupunki + "?departure_date=" + pvm;
    }
    xhr.open("GET", url);
    xhr.onreadystatechange = valmis;
    xhr.send();

    function valmis() {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            var junantyyppi;
            var laituri;
            var peruutusteksti;
            var taulukko = JSON.parse(xhr.responseText);
            for (i in taulukko) {
                console.log(i);
                if (taulukko[i].trainCategory === "Long-distance") {
                    junantyyppi = "kaukojuna";
                }
                else {
                    junantyyppi = "lähijuna";
                }
                if (taulukko[i].timeTableRows[i].commercialTrack == "") {
                    laituri = "ei tiedossa";
                }
                else {
                    laituri = taulukko[i].timeTableRows[i].commercialTrack;
                }
                if (taulukko[i].timeTableRows[i].cancelled == "true") {
                    peruutusteksti = "VUORO PERUTTU! Terveisin VR :D";
                }
                else {
                    peruutusteksti = "";
                }
                document.getElementById("lista").innerHTML += "<ol>" + peruutusteksti + "Junavuoro: " + taulukko[i].trainNumber + " " + taulukko[i].trainType + " (" + junantyyppi + "),  lähtöaika: " + new Date(taulukko[i].timeTableRows[i].scheduledTime).toLocaleTimeString().bold() + ", saapumisaika: " + new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime).toLocaleTimeString() + ", lähtölaituri: " + laituri;
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

*/

/*
//Aarni ja Sara
document.getElementById("haeBtn").addEventListener("click", fromWhere);
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
*/
