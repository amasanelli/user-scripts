// ==UserScript==
// @name         Albor - Comprobante de compra
// @version      1.0
// @namespace    https://github.com/amasanelli/albor-patch
// @description  Agrega medio de pago a comprobante de compra
// @author       masanelli.a
// @match        https://adblick.alboragro.com/1/Comprobantes_Compra/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// @downloadURL  https://github.com/amasanelli/albor-patch/raw/main/Albor%20-%20Comprobante%20de%20compra.user.js
// ==/UserScript==

(function() {

    function parseObs(obs) {
        var arr = obs.split(' | ');
        var res = {};

        for (var i=0; i < arr.length; i++) {
            var element = arr[i];
            if (element.startsWith('MDP=')) {
                res.MDP = element.substring(4);
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

        obj.value = 'CMT=' + obs.CMT + ' | MDP=' + obs.MDP;
    }

    function getComprobante(id) {
        var req = new XMLHttpRequest();
        req.open('GET', 'https://adblick.alboragro.com/1/Ordenes_Compra/Detail/' + id, false);
        req.send(null);
        if (req.status == 200) {
            var obs = new Set();
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(req.responseText, 'text/html');
            obs.add(responseDoc.getElementById('Observaciones').value);
            var data = Array.from(obs).join(', ');
            return data;
        }
    }

    function addPatch() {
        var obs = document.getElementById('Observaciones');
        obs.readOnly = true;
        obs.style.backgroundColor = '#f2f2f2';

        var parsedObs = parseObs(obs.value);

        var frame0 = document.getElementById('grales-cbte-cpra');
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
        label1.appendChild(document.createTextNode('Medio de pago'));

        var mdp = document.createElement('textarea');
        mdp.style.marginBottom = '30px';
        mdp.value = parsedObs.MDP;
        mdp.onchange = function() {
            parsedObs.MDP = mdp.value;
            updateObs(parsedObs);
        }

        var br1 = document.createElement('br');

        var label2 = document.createElement('label');
        label2.class = 'control-label';
        label2.appendChild(document.createTextNode('Agregar medio'));

        var pct = document.createElement('input');
        pct.classList.add('form-control');
        pct.type = 'number';
        pct.value = 100;

        var label3 = document.createElement('span');
        label3.appendChild(document.createTextNode(' %'));
        label3.style.marginRight = '10px';

        var select = document.createElement('select');
        var opt1 = document.createElement('option');
        opt1.appendChild(document.createTextNode('APORTE'));
        var opt2 = document.createElement('option');
        opt2.appendChild(document.createTextNode('CANJE'));
        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode('CH-Fis'));
        var opt4 = document.createElement('option');
        opt4.appendChild(document.createTextNode('Echeq'));
        var opt5 = document.createElement('option');
        opt5.appendChild(document.createTextNode('TC'));
        var opt6 = document.createElement('option');
        opt6.appendChild(document.createTextNode('Transf'));
        var opt7 = document.createElement('option');
        opt7.appendChild(document.createTextNode('CH-Fis-Terc'));
        var opt8 = document.createElement('option');
        opt8.appendChild(document.createTextNode('Echeq-Terc'));
        var opt9 = document.createElement('option');
        opt9.appendChild(document.createTextNode('COMPENSACION'));
        select.appendChild(opt1);
        select.appendChild(opt2);
        select.appendChild(opt3);
        select.appendChild(opt4);
        select.appendChild(opt5);
        select.appendChild(opt6);
        select.appendChild(opt7);
        select.appendChild(opt8);
        select.appendChild(opt9);
        select.style.marginRight = '10px';
        select.value = 'Transf';

        var d = document.createElement('input');
        d.classList.add('form-control');
        d.type = 'number';
        d.value = 30;

        var label4 = document.createElement('span');
        label4.appendChild(document.createTextNode(' d'));
        label4.style.marginRight = '10px';

        var btn0 = document.createElement('span');
        btn0.style.border = '1px solid #000000';
        btn0.style.padding = '5px';
        btn0.style.backgroundColor = '#cccccc';
        btn0.style.cursor = 'pointer';
        btn0.appendChild(document.createTextNode('Agregar'));
        btn0.onclick = function() {
            if (pct.value == '' || d.value == '') {
                alert('Faltan datos')
                return;
            }
            if (mdp.value == 'undefined') {
                mdp.value = '';
            }
            mdp.value += (mdp.value == '' ? '' : ' + ') + pct.value + ' % ' + select.value + ' ' + d.value + ' d';

            parsedObs.MDP = mdp.value;
            updateObs(parsedObs);
        }

        patch.appendChild(label0);
        patch.appendChild(cmt);
        patch.appendChild(br0);

        patch.appendChild(label1);
        patch.appendChild(mdp);
        patch.appendChild(br1);

        patch.appendChild(label2);
        patch.appendChild(pct);
        patch.appendChild(label3);
        patch.appendChild(select);
        patch.appendChild(d);
        patch.appendChild(label4);
        patch.appendChild(btn0);

        frame0.appendChild(patch);

        var frame1 = document.getElementById('opciones-vinculaciones');

        var btn1 = document.createElement('span');
        btn1.style.border = '1px solid #000000';
        btn1.style.padding = '5px';
        btn1.style.backgroundColor = '#cccccc';
        btn1.style.cursor = 'pointer';
        btn1.appendChild(document.createTextNode('Ver obs'));
        btn1.onclick = function() {
            var tbl = document.getElementById('DetalleGrid');

            var comprobantes = new Set();
            var rows = [];

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

            var head = document.getElementById('jqgh_DetalleGrid_Unidad_Medida');
            head.innerHTML = 'Observaciones';

            if (rows.length == 0) { return }

            for (let i = 1, row; row = tbl.rows[i]; i++) {
                for (let j = 0, col; col = row.cells[j]; j++) {
                    if (col.getAttribute('aria-describedby') == 'DetalleGrid_Unidad_Medida') {
                        console.log(col.title);
                        col.title = rows[i - 1][1];
                        col.appendChild(document.createTextNode(rows[i - 1][1]));
                    }
                }
            }
        }

        frame1.appendChild(btn1);

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
