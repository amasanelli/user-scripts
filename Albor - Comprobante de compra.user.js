// ==UserScript==
// @name         Albor - Comprobante de compra
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega medio de pago a comprobante de compra
// @author       masanelli.a
// @match        https://adblick.alboragro.com/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// ==/UserScript==

(function() {
    var elemento = document.getElementById('grales-cbte-cpra');
    var patch = document.createElement("li");

    var label = document.createElement("label");
    label.class = "control-label";
    label.appendChild(document.createTextNode("Medio de pago"));

    var select = document.createElement("select");
    var opt1 = document.createElement("option");
    opt1.appendChild(document.createTextNode("OPT1"));
    select.appendChild(opt1);

    patch.appendChild(label);
    patch.appendChild(select);

    elemento.appendChild(patch);
})();