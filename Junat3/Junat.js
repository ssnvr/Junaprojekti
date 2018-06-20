
//Aarni ja Sara
document.getElementById("nappi").addEventListener("click", fromWhere);
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