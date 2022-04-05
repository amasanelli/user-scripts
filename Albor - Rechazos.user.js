// ==UserScript==
// @name         Albor - Rechazos
// @version      3.1
// @namespace    https://github.com/amasanelli/user-scripts
// @description  Almacena datos de CP rechazada
// @author       masanelli.a
// @include      /(https://adblick.alboragro.com/1/Comprobantes_Cosecha)(?!/)/
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Rechazos.user.js
// @downloadURL  https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Rechazos.user.js
// ==/UserScript==

(function() {
    'use strict';

    function get_select_html() {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://query-albor-ad-hoc-r-ys4nimzqdq-uc.a.run.app', false);
        xhr.send();

        var html = '<select style="width: 150px; text-align: center;"><option value="">Completar</option>';

        const resp = JSON.parse(xhr.response);

        if (xhr.status == 200) {
            for(const motivo of resp.data.motivos) {
                //console.log(motivo);
                html += `<option value="${motivo}">${motivo}</option>`;
            }
        }

        html += '</select><input type="number" style="width: 50px;"></input>';

        return html;
    }

    const select_html = get_select_html();

    const opciones_html = `
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

    <div>
    </br>
    <span id="estado"></span>
    </div>
    `

    function mostrarAlerta(id_comprobante_origen) {
        $.Alerta('cargando...', 'Rechazar');

        const dialogContent = document.evaluate('//div[text()="cargando..."]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;;
        dialogContent.innerHTML = opciones_html;

        const estado = document.getElementById('estado');
        estado.textContent = '';

        const btnAgregar = document.getElementById('agregarMotivo');
        btnAgregar.onclick = function() {
            const container = document.getElementById('motivos');
            const select = document.createElement('div');
            select.innerHTML = select_html;
            container.appendChild(select);
        }

        const btnSalir = document.getElementById('btAceptarAlerta');
        btnSalir.textContent = 'Salir';

        const dialogBtnSet = btnSalir.parentElement;

        const btnRechazar = document.createElement('button');
        btnRechazar.textContent = 'Rechazar';
        btnRechazar.onclick = function(event) {

            const pv_destino = document.getElementById('pv_destino').value;
            const cp_destino = document.getElementById('cp_destino').value;

            if (!pv_destino || !cp_destino) {
                return alert('Faltan datos')
            }

            estado.textContent = 'Procesando...';

            const data = {
                'motivos': [],
                'id_comprobante_origen': id_comprobante_origen,
                'pv_destino': pv_destino,
                'cp_destino': cp_destino,
            }

            const motivos = document.getElementById('motivos');

            for (let i = 0; i < motivos.children.length; i++) {
                const motivo = motivos.children[i].children[0].value;
                const valor = parseFloat(motivos.children[i].children[1].value);

                if (motivo == '' || !valor) {
                    return alert('Faltan datos')
                }

                data.motivos.push({'motivo': motivo, 'valor': valor});
            }

            //console.log(data);

            const encodedData = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
            //console.log(encodedData);

            const json = {
                'message': {
                    'data': encodedData
                }
            }
            //console.log(json);

            const xhr = new XMLHttpRequest();

            xhr.onload = function() {
                const resp = JSON.parse(xhr.response);
                //console.log(resp);
                estado.textContent = resp.message;
            };
            xhr.open('POST', 'https://query-albor-ad-hoc-r-ys4nimzqdq-uc.a.run.app', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(json));
        }

        dialogBtnSet.insertBefore(btnRechazar, dialogBtnSet.firstChild);
    }

    const panel = document.getElementById('btNuevoRegistro').parentElement.parentElement;
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = '#';
    a.onclick = function(event) {
        event.preventDefault();

        const ids = obtenerIDsSeleccionadosGrilla('#DetalleGrid');
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

    console.log('RECHAZOS');
})();
