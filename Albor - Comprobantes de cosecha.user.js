// ==UserScript==
// @name         Albor - Comprobantes de cosecha
// @version      1.2
// @namespace    https://github.com/amasanelli/user-scripts
// @description  Agrega porcentaje aforo
// @author       masanelli.a
// @match        https://adblick.alboragro.com/1/Comprobantes_Cosecha/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Comprobantes%20de%20cosecha.user.js
// @downloadURL  https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Comprobantes%20de%20cosecha.user.js
// ==/UserScript==

(function() {
    function getElementByXPath(xpath) {
        return new XPathEvaluator()
            .createExpression(xpath)
            .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
            .singleNodeValue
    }

    function calcular() {
        const aforado = document.getElementById('Aforado').checked;
        if(aforado) {
            const input = document.getElementById('pct_aforo');
            const select = document.getElementById('origen_peso_aforo').value;
            const destino = document.getElementById('Peso_Aforado');

            var peso = 0;
            if(select === 'origen') {
                peso = document.getElementById('Peso_Origen_Neto').value;
            } else {
                peso = document.getElementById('Peso_Destino_Neto').value;
            }

            peso = peso.replace('.','');

            destino.value = Math.round(parseInt(peso) * parseFloat(input.value));
            destino.focus();
            input.focus();
        }
    }

    function addPatch() {
        const frame0 = getElementByXPath('//li[@id="datos-aforado"]//div');

        const patch = document.createElement('span');
        patch.innerHTML = `
        <select id="origen_peso_aforo" class="form-control">
           <option value="origen">Peso Origen</option>
           <option value="destino">Peso Destino</option>
        </select>
        <input id="pct_aforo" placeholder="Factor aforo" class="form-control nro" type="number"/>
        `

        frame0.appendChild(patch);

        const aforado = document.getElementById('Aforado');
        aforado.onchange = function() {
            calcular();
        }

        const input = document.getElementById('pct_aforo');
        input.onchange = function() {
            calcular();
        }

        const select = document.getElementById('origen_peso_aforo');
        select.onchange = function() {
            calcular();
        }
    }

    const tipo = document.getElementById('ID_Tipo_Comprobante');
    if (!tipo) { return }

    if (tipo.type == 'hidden') {
        addPatch();
    } else {
        tipo.onchange = function() {
            addPatch();
        }
    }

})();
