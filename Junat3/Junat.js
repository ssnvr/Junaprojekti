
//Aarni ja Sara

document.getElementById("nappi").addEventListener("click", fromWhere);
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

$.getJSON("https://rata.digitraffic.fi/api/v1/metadata/stations", function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].passengerTraffic === true) {
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit1");
            $('<option value="' + data[i].stationShortCode + '">' + data[i].stationName + '</option>').appendTo("#kaupungit2");
        }
    }
});

function fromWhere() {

    document.getElementById("lista").innerHTML = "";
    lähtökaupunki = kaupungit1.value;
    kohdekaupunki = kaupungit2.value;

    pvm = $("#kalenteri").val();
    console.log(pvm);
    console.log(lähtökaupunki);
    console.log(kohdekaupunki);
    if (pvm === "" || pvm === null) {
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
            if (xhr.responseText.includes("TRAIN_NOT_FOUND")) {
                alert("Hakemiesi asemien välillä ei ole suoraa junayhteyttä");
            }
            var taulukko = JSON.parse(xhr.responseText);
            for (i in taulukko) {

                lähtöaika = new Date(taulukko[i].timeTableRows[0].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).bold();
                saapumisaika = new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).bold();
                erotus = new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime) - new Date(taulukko[i].timeTableRows[0].scheduledTime);

                function msToTime(duration) {
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
                for (j in taulukko[i].timeTableRows) {
                    if (taulukko[i].timeTableRows[j].stationShortCode === kohdekaupunki && taulukko[i].timeTableRows[j].trainStopping === false) {
                        eipysähdy = " HUOM! Juna ei pysähdy tällä asemalla";
                    }
                }

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