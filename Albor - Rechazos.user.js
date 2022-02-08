// ==UserScript==
// @name         Albor - Rechazos
// @version      1.0
// @namespace    https://github.com/amasanelli/albor-patch
// @description  Almacena datos de CP rechazada
// @author       masanelli.a
// @match        https://adblick.alboragro.com/1/Comprobantes_Cosecha
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Rechazos.user.js
// @downloadURL  https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Rechazos.user.js
// ==/UserScript==

(function() {
    'use strict';

    var select_html = `
    <select style="width: 150px; text-align: center;">
    <option value="">Completar</option>
    <option value="BAHIA BLANCA">BAHIA BLANCA</option>
    <option value="CAÑUELAS">CAÑUELAS</option>
    <option value="JUNIN">JUNIN</option>
    <option value="LAS PALMAS">LAS PALMAS</option>
    <option value="LIMA">LIMA</option>
    <option value="NECOCHEA">NECOCHEA</option>
    <option value="ROSARIO">ROSARIO</option>
    <option value="VILLA MADERO">VILLA MADERO</option>
    <option value="VILLA PARANACITO">VILLA PARANACITO</option>
    <option value="VILLA RAMALLO">VILLA RAMALLO</option>
    </select>

    <input type="number" style="width: 50px;"></input>
    `

    var opciones_html = `
    <div id="opciones">
    <span style="width: 150px; text-align: center; display: inline-block">Motivo</span>
    <span style="width: 50px; text-align: center; display: inline-block">Valor</span>
    </br>
    <div id="motivos">
    <div>
    ${select_html}
    </div>
    </div>
    </div>

    </br>
    <div>
    <button id="agregarMotivo">Agregar motivo</button>
    </div>

    </br>
    <div>
    PV: <input id="pv_destino" type="number" style="width: 100px;"></input> - CP: <input id="cp_destino" type="number" style="width: 100px;"></input>
    </div>
    `

    function mostrarAlerta(id_cp_origen) {
        $.Alerta('cargando...', 'Rechazar');

        var dialogContent = document.evaluate('//div[text()="cargando..."]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;;
        dialogContent.innerHTML = opciones_html;

        var btnAgregar = document.getElementById('agregarMotivo');
        btnAgregar.onclick = function() {
            var container = document.getElementById('motivos');
            var select = document.createElement('div');
            select.innerHTML = select_html;
            container.appendChild(select);
        }

        var btnSalir = document.getElementById('btAceptarAlerta');
        btnSalir.textContent = 'Salir';

        var dialogBtnSet = btnSalir.parentElement;

        var btnRechazar = document.createElement('button');
        btnRechazar.textContent = 'Rechazar';
        btnRechazar.onclick = function(event) {

            const pv_destino = parseInt(document.getElementById('pv_destino').value);
            const cp_destino = parseInt(document.getElementById('cp_destino').value);

            if (!pv_destino || !cp_destino) {
                return alert('Faltan datos')
            }

            var json = {
                'motivos': [],
                'id_cp_origen': id_cp_origen,
                'pv_destino': pv_destino,
                'cp_destino': cp_destino,
            }

            const motivos = document.getElementById('motivos');

            for (let i = 0; i < motivos.children.length; i++) {
                const motivo = motivos.children[i].children[0].value;
                const valor = parseInt(motivos.children[i].children[1].value);

                if (motivo == '' || !valor) {
                    return alert('Faltan datos')
                }

                json.motivos.push({'motivo': motivo, 'valor': valor});
            }

            console.log(json);
        }

        dialogBtnSet.insertBefore(btnRechazar, dialogBtnSet.firstChild);
    }

    var panel = document.getElementById('btNuevoRegistro').parentElement.parentElement;
    var li = document.createElement('li');

    var a = document.createElement('a');
    a.href = '#';
    a.onclick = function(event) {
        event.preventDefault();

        var ids = obtenerIDsSeleccionadosGrilla("#DetalleGrid");
        if(ids.length == 0) {
            return alert('Seleccione un registro');
        };
        if(ids.length > 1) {
            return alert('Seleccione solo un registro');
        };

        mostrarAlerta(ids[0]);
    };
    a.textContent = 'Rechazar';

    li.appendChild(a);
    panel.appendChild(li);


    //mostrarReporteEnDialogo("#dialogoReporte", "NecesidadesInsumosOT", "Necesidades Insumos", undefined);
})();