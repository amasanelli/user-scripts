// ==UserScript==
// @name         Albor - Comprobante de compra
// @version      2.0
// @namespace    https://github.com/amasanelli/user-scripts
// @description  Agrega medio de pago a comprobante de compra
// @author       masanelli.a
// @match        https://adblick.alboragro.com/1/Comprobantes_Compra/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// @downloadURL  https://github.com/amasanelli/user-scripts/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// ==/UserScript==

(function() {

    const opts = ['APORTE', 'CANJE', 'CH-Fis', 'Echeq', 'TC', 'Transf', 'CH-Fis-Terc', 'Echeq-Terc', 'COMPENSACION', 'MUTUO', 'Con descuento 5%'];
    var parsedObs = {};

    function parseObs(obs) {
        const arr = obs.split(' | ');
        const res = {};

        for (let i=0; i < arr.length; i++) {
            const element = arr[i];
            if (element.startsWith('MDP=')) {
                res.MDP = element.substring(4);
            } else if (element.startsWith('CMT=')) {
                res.CMT = element.substring(4);
            } else if (element.startsWith('RTO=')) {
                res.RTO = element.substring(4);
            } else {
                res.CMT = element;
            }
        }
        console.log(res);

        return res;
    }

    function updateObs(obs) {
        const obj = document.getElementById('Observaciones');
        obj.value = 'CMT=' + obs.CMT + ' | MDP=' + obs.MDP + ' | RTO=' + obs.RTO;
    }

    function getComprobante(id) {
        const req = new XMLHttpRequest();
        req.open('GET', 'https://adblick.alboragro.com/1/Ordenes_Compra/Detail/' + id, false);
        req.send(null);
        if (req.status == 200) {
            const obs = new Set();
            const parser = new DOMParser();
            const responseDoc = parser.parseFromString(req.responseText, 'text/html');
            obs.add(responseDoc.getElementById('Observaciones').value);
            const data = Array.from(obs).join(', ');
            return data;
        }
    }

    function agregarMedioDePago() {
        const medio_pct = document.getElementById('medio_pct').value;
        const medio_len = document.getElementById('medio_len').value;
        const medio_sel = document.getElementById('medio_sel').value;
        const mdp = document.getElementById('mdp');

        if (medio_pct == '' || medio_len == '') {
            alert('Faltan datos')
            return;
        }
        if (mdp.value == 'undefined') {
            mdp.value = '';
        }
        mdp.value += (mdp.value == '' ? '' : ' + ') + medio_pct + ' % ' + medio_sel + ' ' + medio_len + ' d';

        parsedObs.MDP = mdp.value;
        updateObs(parsedObs);
    }

    function agregarRemito() {
        const remito_pre = document.getElementById('remito_pre').value;
        const remito_suf = document.getElementById('remito_suf').value;
        const rto = document.getElementById('rto');

        if (remito_pre == '' || remito_suf == '') {
            alert('Faltan datos')
            return;
        }
        if (rto.value == 'undefined') {
            rto.value = '';
        }
        rto.value += (rto.value == '' ? '' : '; ') + parseInt(remito_pre) + '-' + parseInt(remito_suf);

        parsedObs.RTO = rto.value;
        updateObs(parsedObs);
    }

    function verObservaciones() {
        const tbl = document.getElementById('DetalleGrid');

        const comprobantes = new Set();
        const rows = [];

        for (let i = 0, row; row = tbl.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (col.getAttribute('aria-describedby') == 'DetalleGrid_ItemVinculable') {
                    let json = col.title;
                    try {
                        json = json.replace('_TERRAJSON_','').replaceAll("'",'"');
                        json = JSON.parse(json);
                        let id = json.ID_Comprobante;
                        comprobantes.add(id);
                        rows.push([id,'']);
                    } catch (err) {
                        console.log('Item sin detalle item vinculable');
                    }
                    break;
                }
            }
        }

        for (let it = comprobantes.values(), comprobante; comprobante=it.next().value;) {
            let obs = getComprobante(comprobante);
            rows.forEach(element => {
                if (element[0] == comprobante) {
                    element[1] = obs;
                }
            })
        }

        const head = document.getElementById('jqgh_DetalleGrid_Unidad_Medida');
        head.innerHTML = 'Observaciones';

        if (rows.length == 0) { return }

        for (let i = 1, row; row = tbl.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (col.getAttribute('aria-describedby') == 'DetalleGrid_Unidad_Medida') {
                    col.innerHTML = rows[i - 1][1];
                }
            }
        }
    }

    function verObservacionsGrid() {
        const tbl = document.getElementById('GridVinculacionesPosibles');

        const head = document.getElementById('jqgh_GridVinculacionesPosibles_Numero_Comprobante');
        head.innerHTML = 'Observaciones';

        const rows = [];

        for (let i = 0, row; row = tbl.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (col.getAttribute('aria-describedby') == 'GridVinculacionesPosibles_Comprobante') {
                    console.log(col.title);
                    rows.push(getComprobante(col.title));
                }
            }
        }

        for (let i = 0, row; row = tbl.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (col.getAttribute('aria-describedby') == 'GridVinculacionesPosibles_Numero_Comprobante') {
                    col.innerHTML = rows[i];
                }
            }
        }
    }

    function addPatch() {
        const obs = document.getElementById('Observaciones');
        obs.readOnly = true;
        obs.style.backgroundColor = '#f2f2f2';

        parsedObs = parseObs(obs.value);

        const frame0 = document.getElementById('grales-cbte-cpra');

        const comentarios = document.createElement('li');
        comentarios.innerHTML = `
        <label class="control-label">Comentarios</label>
        <span class="inline-labels">
           <textarea id="cmt" class="form-control"></textarea>
        </span>
        `

        const medios_de_pago = document.createElement('li');
        medios_de_pago.innerHTML = `
        <label class="control-label">Medio de pago</label>
        <span class="inline-labels">
           <textarea id="mdp" class="form-control"></textarea>
        </span>
        `

        const medio_de_pago = document.createElement('li');
        medio_de_pago.innerHTML = `
        <label class="control-label">Agregar medio</label>
        <span class="inline-labels">
           <input id="medio_pct" class="form-control" type="number">
           <span class="control-label"> %</span>
           <select id="medio_sel" class="form-control"></select>
           <input id="medio_len" class="form-control" type="number">
           <span class="control-label"> d</span>
           <input id="medio_btn" type="button" value="Agregar">
        </span>
        `

        const remitos = document.createElement('li');
        remitos.innerHTML = `
        <label class="control-label">Remitos</label>
        <span class="inline-labels">
           <textarea id="rto" class="form-control"></textarea>
        </span>
        `;

        const remito = document.createElement('li');
        remito.innerHTML = `
        <label class="control-label">Agregar remito</label>
        <span class="inline-labels">
           <input id="remito_pre" class="form-control" type="number">
           <span class="control-label"> - </span>
           <input id="remito_suf" class="form-control" type="number">
           <input id="remito_btn" type="button" value="Agregar">
        </span>
        `

        frame0.appendChild(comentarios);
        frame0.appendChild(medios_de_pago);
        frame0.appendChild(medio_de_pago);
        frame0.appendChild(remitos);
        frame0.appendChild(remito);

        const cmt = document.getElementById('cmt');
        cmt.value = parsedObs.CMT;
        cmt.onchange = function() {
            parsedObs.CMT = cmt.value;
            updateObs(parsedObs);
        }

        const mdp = document.getElementById('mdp');
        mdp.value = parsedObs.MDP;
        mdp.onchange = function() {
            parsedObs.MDP = mdp.value;
            updateObs(parsedObs);
        }

        const medio_sel = document.getElementById('medio_sel');
        for (let i=0; i < opts.length; i++) {
            const opt = document.createElement('option');
            opt.appendChild(document.createTextNode(opts[i]));
            medio_sel.appendChild(opt);
        }
        medio_sel.value = 'Transf';

        const medio_btn = document.getElementById('medio_btn');
        medio_btn.addEventListener('click', agregarMedioDePago);

        const rto = document.getElementById('rto');
        rto.value = parsedObs.RTO;
        rto.onchange = function() {
            parsedObs.RTO = rto.value;
            updateObs(parsedObs);
        }

        const remito_btn = document.getElementById('remito_btn');
        remito_btn.addEventListener('click', agregarRemito);


        /*
        */

        const frame1 = document.getElementById('opciones-vinculaciones');

        const ops_obs = document.createElement('span');
        ops_obs.innerHTML = `
        <input type="button" value="Ver obs" id="obs_btn" style="font-size: 11px; padding: 2px 8px;">
        `;

        frame1.appendChild(ops_obs);

        const obs_btn = document.getElementById('obs_btn');
        obs_btn.addEventListener('click', verObservaciones);


        /*
        */

        window.setInterval(function() {
            const frame2 = document.getElementById('dialog-vinculaciones');

            const visible = frame2.innerHTML.includes('<') && frame2.parentNode.style.display != 'none';

            if (visible && !visible_old) {

                const ops_obs = document.createElement('span');
                ops_obs.innerHTML = `
                <input type="button" value="Ver obs" id="obs_grid_btn" style="font-size: 11px; padding: 2px 8px;">
                `;

                frame2.appendChild(ops_obs);

                const obs_btn = document.getElementById('obs_grid_btn');
                obs_btn.addEventListener('click', verObservacionsGrid);
            }

            visible_old = visible;
        }, 1000);

    }

    var visible_old = false;

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
