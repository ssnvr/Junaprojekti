document.getElementById("nappi").addEventListener("click", hae);
var xhr = new XMLHttpRequest();

function hae() {
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE");
    xhr.onreadystatechange = valmis;
    xhr.send();

}
function valmis() {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        var laskuri = 1;
        var junantyyppi;
        var taulukko = JSON.parse(xhr.responseText);
        for (i in taulukko) {
            if (taulukko[i].trainCategory === "Long-distance") {
                junantyyppi = "kaukojuna";
            }
            else {
                junantyyppi = "lähijuna";
            }

            document.getElementById("lista").innerHTML += "<ol>" + laskuri + ". Junan vuoronumero: " + taulukko[i].trainNumber + " " + taulukko[i].trainType + ", junan tyyppi: " + taulukko[i].trainCategory + ", lähtöaika: " + new Date(taulukko[i].timeTableRows[i].scheduledTime).toLocaleTimeString() + ", saapumisaika: " + new Date(taulukko[i].timeTableRows[oikeaIndeksi()].scheduledTime).toLocaleTimeString();
            laskuri++;
            function oikeaIndeksi() {
                for (j in taulukko[i].timeTableRows) {
                    if (taulukko[i].timeTableRows[j].stationShortCode === "TPE") {
                        return j;
                    }
                }
            }
            function 
        }
    }
}