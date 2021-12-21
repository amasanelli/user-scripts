// ==UserScript==
// @name         Albor - Orden de trabajo
// @version      1.0
// @namespace    https://github.com/amasanelli/albor-patch
// @description  Agrega tilde descuento a OT
// @author       masanelli.a
// @match        https://adblick.alboragro.com/1/Ordenes_Trabajo/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// @downloadURL  https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// ==/UserScript==

(function() {

    function getElementByXPath(xpath) {
        return new XPathEvaluator()
            .createExpression(xpath)
            .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
            .singleNodeValue
    }

    function parseObs(obs) {
        var arr = obs.split(' | ');
        var res = {};

        for (var i=0; i < arr.length; i++) {
            var element = arr[i];
            if (element.startsWith('DES=')) {
                res.DES = element.substring(4) == 'true';
            } else if (element.startsWith('CMT=')) {
                res.CMT = element.substring(4);
            } else {
                res.CMT = element;
            }
        }
        console.log(res);

        return res;
    }

    function updateObs(obs) {
        var obj = document.getElementById('Observaciones');

        obj.value = 'CMT=' + obs.CMT + ' | DES=' + obs.DES;
    }

    function addPatch() {
        var obs = document.getElementById('Observaciones');
        obs.readOnly = true;
        obs.style.backgroundColor = '#f2f2f2';

        var parsedObs = parseObs(obs.value);

        var frame0 = getElementByXPath("//div[@id='OTGenerales']//ul");

        var patch = document.createElement('li');

        var label0 = document.createElement('label');
        label0.class = 'control-label';
        label0.appendChild(document.createTextNode('Comentarios'));

        var cmt = document.createElement('textarea');
        cmt.style.marginBottom = '30px';
        cmt.value = parsedObs.CMT;
        cmt.onchange = function() {
            parsedObs.CMT = cmt.value;
            updateObs(parsedObs);
        }

        var br0 = document.createElement('br');

        var label1 = document.createElement('label');
        label1.class = 'control-label';
        label1.appendChild(document.createTextNode('Descuento 5%'));

        var des = document.createElement('input');
        des.type = 'checkbox';
        des.checked = parsedObs.DES;
        des.onchange = function() {
            console.log(des.checked);
            parsedObs.DES = des.checked;
            updateObs(parsedObs);
        }

        patch.appendChild(label0);
        patch.appendChild(cmt);
        patch.appendChild(br0);

        patch.appendChild(label1);
        patch.appendChild(des);

        frame0.appendChild(patch);
    }

    var tipo = document.getElementById('ID_Tipo_Comprobante');
    if (!tipo) { return }

    if (tipo.type == 'hidden') {
        addPatch();
    } else {
        tipo.onchange = function() {
            addPatch();
        }
    }

})();
