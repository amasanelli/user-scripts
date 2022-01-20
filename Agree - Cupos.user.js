// ==UserScript==
// @name         Agree - Cupos
// @version      2.0
// @namespace    https://github.com/amasanelli/albor-patch
// @description  Envia datos de cupos a Green Eye
// @author       masanelli.a
// @match        https://app.agree.ag/company/1409/*
// @icon         https://www.google.com/s2/favicons?domain=greeneye.herokuapp.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/amasanelli/albor-patch/raw/main/Agree%20-%20Cupos.user.js
// @downloadURL  https://github.com/amasanelli/albor-patch/raw/main/Agree%20-%20Cupos.user.js
// ==/UserScript==

(function() {

    function getElementByXPath(xpath) {
        return new XPathEvaluator()
            .createExpression(xpath)
            .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
            .singleNodeValue
    }



    function getCPItem(item, col) {
        const items = countElementsByXPath("(//table[contains(@class, 'table table-condensed')])[1]//tr//td[1]");

        if(items < 8) {
            throw 'No data';
        }

        for(let i=1; i<=items; i++) {
            if(getElementByXPath(`(//table[contains(@class, 'table table-condensed')])[1]//tr[${i}]//td[1]`).textContent == item) {
                return getElementByXPath(`(//table[contains(@class, 'table table-condensed')])[1]//tr[${i}]//td[${col}]`).textContent;
            }
        }

        return '';
    }

    function countElementsByXPath(xpath) {
        return new XPathEvaluator()
            .createExpression('count(' + xpath + ')')
            .evaluate(document, XPathResult.NUMBER_TYPE)
            .numberValue
    }

    function getNumber(string) {
        return string.replaceAll(/[^0-9]/g,'');
    }

    function split(string, position) {
        return string.split(',')[position];
    }

    function getData(id) {
        return document.getElementById(id) && document.getElementById(id).value ? document.getElementById(id).value : undefined;
    }

    function month(str) {
        return str.toLowerCase().replace('ene', 'jan').replace('abr', 'apr').replace('ago', 'aug').replace('dic', 'dec');
    }

    var urlChanged = true;
    var currentPage = location.href;
    setInterval(function() {
        if (currentPage != location.href) {
            currentPage = location.href;
            urlChanged = true;
        }
    }, 1000);

    const timer = window.setInterval(function() {
        if (getElementByXPath("//*[text() = 'Lote de Cupos']") == null || !urlChanged) { return }

        try {
            const box = getElementByXPath("//div[@class='content-box']");

            var tbl = document.createElement('table');
            //tbl.setAttribute('border', 1);
            tbl.setAttribute('style', "text-align: center; border: 1px solid black;");
            tbl.innerHTML = `<tr><td width=300>*Datos faltantes*</td><td width=200>Nombre/Detalle</td><td width=200>CUIT</td></tr>
            <tr><td>*Titular Carta Porte*</td><td><input id="cp_titular_nombre" style="width: 200px; text-align: center;" value=""></td><td><input id="cp_titular_cuit" type="number" style="width: 200px; text-align: center;" value=""></td></tr>
            <tr><td>*Remitente Comercial Productor*</td><td><input id="cp_rte_com_prod_nombre" style="width: 200px; text-align: center;" value=""></td><td><input id="cp_rte_com_prod_cuit" type="number" style="width: 200px; text-align: center;" value=""></td></tr>
            <tr><td>*Remitente Comercial Venta Primaria*</td><td><input id="cp_rte_com_vta_pri_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Rte. Comercial Venta Primaria', 2) + `"></td><td><input id="cp_rte_com_vta_pri_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Rte. Comercial Venta Primaria', 3)) + `"></td></tr>
            <tr><td>*Remitente Comercial Venta Secundaria*</td><td><input id="cp_rte_com_vta_sec_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Rte. Comercial Venta Secundaria', 2) + `"></td><td><input id="cp_rte_com_vta_sec_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Rte. Comercial Venta Secundaria', 3)) + `"></td></tr>
            <tr><td>*Remitente Comercial Venta Secundaria 2*</td><td><input id="cp_rte_com_vta_sec_2_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Rte. Comercial Venta Secundaria 2', 2) + `"></td><td><input id="cp_rte_com_vta_sec_2_cuit" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Rte. Comercial Venta Secundaria 2', 3)) + `"></td></tr>
            <tr><td>*Mercado a Término*</td><td><input id="cp_merc_a_ter_nombre" style="width: 200px; text-align: center;" value=""></td><td><input id="cp_merc_a_ter_cuit" style="width: 200px; text-align: center;" value=""></td></tr>
            <tr><td>*Corredor Venta Primaria*</td><td><input id="cp_corr_vta_pri_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Corredor Venta Primaria', 2) + `"></td><td><input id="cp_corr_vta_pri_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Corredor Venta Primaria', 3)) + `"></td></tr>
            <tr><td>*Corredor Venta Secundaria*</td><td><input id="cp_corr_vta_sec_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Corredor Venta Secundaria', 2) + `"></td><td><input id="cp_corr_vta_sec_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Corredor Venta Secundaria', 3)) + `"></td></tr>
            <tr><td>*Representante / Entregador*</td><td><input id="cp_repr_entr_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Representante entregador', 2) + `"></td><td><input id="cp_repr_entr_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Representante entregador', 3)) + `"></td></tr>
            <tr><td>*Destinatario*</td><td><input id="cp_destinatario_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Destinatario', 2) + `"></td><td><input id="cp_destinatario_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Destinatario', 3)) + `"></td></tr>
            <tr><td>*Destino*</td><td><input id="cp_destino_nombre" style="width: 200px; text-align: center;" value="` + getCPItem('Destino', 2) + `"></td><td><input id="cp_destino_cuit" type="number" style="width: 200px; text-align: center;" value="` + getNumber(getCPItem('Destino', 3)) + `"></td></tr>
            <tr><td>-</td><td></td><td></td></tr>
            <tr><td>*Planta*</td><td><input id="cp_planta" style="width: 200px; text-align: center;" value="` + getNumber(getElementByXPath("//div[@class='batch-address']/div/div[3]").textContent) + `"></td><td></td></tr>
            <tr><td>*Dirección*</td><td><input id="cp_direccion" style="width: 200px; text-align: center;" value="` + getElementByXPath("//div[@class='batch-address']/div/div[2]").textContent + `"></td><td></td></tr>
            <tr><td>*Localidad*</td><td><input id="cp_localidad" style="width: 200px; text-align: center;" value="` + split(getElementByXPath("//div[@class='batch-address']/div/p").textContent, 0) + `"></td><td></td></tr>
            <tr><td>*Provincia*</td><td><input id="cp_provincia" style="width: 200px; text-align: center;" value="` + split(getElementByXPath("//div[@class='batch-address']/div/p").textContent, 2) + `"></td><td></td></tr>
            <tr><td>-</td><td></td><td></td></tr>
            <tr><td>*Producto*</td><td><input id="cp_producto" style="width: 200px; text-align: center;" value="` + getElementByXPath("//div[@class='product']").textContent + `"></td><td></td></tr>
            <tr><td>*Observaciones*</td><td><input id="cp_observaciones" style="width: 200px; text-align: center;" value=""></td><td></td></tr>
            <tr><td>-</td><td></td><td></td></tr>
            <tr><td>*Cosecha*</td><td><input id="aux_cosecha" style="width: 200px; text-align: center;" value="21/22"></td><td></td></tr>
            <tr><td>*Contrato*</td><td><input id="aux_contrato" style="width: 200px; text-align: center;" value=""></td><td></td></tr>
            <tr><td>-</td><td></td><td></td></tr>
            <tr><td>*Cultivo*</td><td>
                <select id="cultivo" style="width: 200px; text-align: center;">
                    <option value="">Completar</option>
                    <option value="ARVEJA">ARVEJA</option>
                    <option value="CEBADA CERVECERA">CEBADA CERVECERA</option>
                    <option value="CEBADA FORRAJERA">CEBADA FORRAJERA</option>
                    <option value="COLZA">COLZA</option>
                    <option value="GIRASOL ALTO OLEICO">GIRASOL ALTO OLEICO</option>
                    <option value="GIRASOL COMUN">GIRASOL COMUN</option>
                    <option value="GIRASOL CONFITERO">GIRASOL CONFITERO</option>
                    <option value="MAIZ">MAIZ</option>
                    <option value="SOJA">SOJA</option>
                    <option value="TRIGO">TRIGO</option>
                </select>
            </td><td></td></tr>
            <tr><td>*Puerto*</td><td>
                <select id="puerto" style="width: 200px; text-align: center;">
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
                </select>
            </td><td></td></tr>
            <tr><td>*Organización*</td><td id="org">agropack</td><td></td></tr>
            <tr><td>*Usuario*</td><td id="user">tferri</td><td></td></tr>
            <tr><td>*Entregar a*</td><td><input id="id_pedido" style="width: 200px; text-align: center;" value=""></td><td></td></tr>`;
            box.appendChild(tbl);

            var btn = document.createElement('button');
            btn.innerHTML = 'Aceptar';
            btn.onclick = function() {
                const cupos_count = countElementsByXPath("(//table[contains(@class, 'table table-condensed')])[2]//tbody//tr");

                if (cupos_count == 0) {
                    alert('Faltan cupos!');
                    return;
                }

                if (getData('cultivo') == undefined || getData('puerto') == undefined) {
                    alert('Faltan datos!');
                    return;
                }

                const obj = {
                    'id_cupo': undefined,
                    'fecha_cupo': undefined,
                    'org': document.getElementById('org').textContent,
                    'user': document.getElementById('user').textContent,
                    'cultivo': getData('cultivo'),
                    'puerto': getData('puerto'),
                    'id_pedido': getData('id_pedido'),
                    'cp': {
                        'titular': {
                            'nombre': getData('cp_titular_nombre'),
                            'cuit':  getData('cp_titular_cuit')
                        },
                        'rte_com_prod': {
                            'nombre': getData('cp_rte_com_prod_nombre'),
                            'cuit':  getData('cp_rte_com_prod_cuit')
                        },
                        'rte_com_vta_pri': {
                            'nombre': getData('cp_rte_com_vta_pri_nombre'),
                            'cuit':  getData('cp_rte_com_vta_pri_cuit')
                        },
                        'rte_com_vta_sec': {
                            'nombre': getData('cp_rte_com_vta_sec_nombre'),
                            'cuit':  getData('cp_rte_com_vta_sec_cuit')
                        },
                        'rte_com_vta_sec_2': {
                            'nombre': getData('cp_rte_com_vta_sec_2_nombre'),
                            'cuit':  getData('cp_rte_com_vta_sec_2_cuit')
                        },
                        'merc_a_ter': {
                            'nombre': getData('cp_merc_a_ter_nombre'),
                            'cuit':  getData('cp_merc_a_ter_cuit')
                        },
                        'corr_vta_pri': {
                            'nombre': getData('cp_corr_vta_pri_nombre'),
                            'cuit':  getData('cp_corr_vta_pri_cuit')
                        },
                        'corr_vta_sec': {
                            'nombre': getData('cp_corr_vta_sec_nombre'),
                            'cuit':  getData('cp_corr_vta_sec_cuit')
                        },
                        'repr_entr': {
                            'nombre': getData('cp_repr_entr_nombre'),
                            'cuit':  getData('cp_repr_entr_cuit')
                        },
                        'destinatario': {
                            'nombre': getData('cp_destinatario_nombre'),
                            'cuit':  getData('cp_destinatario_cuit')
                        },
                        'destino': {
                            'nombre': getData('cp_destino_nombre'),
                            'cuit':  getData('cp_destino_cuit')
                        },
                        'planta':  getData('cp_planta'),
                        'direccion':  getData('cp_direccion'),
                        'localidad':  getData('cp_localidad'),
                        'provincia':  getData('cp_provincia'),
                        'producto':  getData('cp_producto'),
                        'observaciones':  getData('cp_observaciones')
                    },
                    'aux': {
                        'contrato': getData('aux_contrato'),
                        'cosecha': getData('aux_cosecha')
                    }
                };

                var ok = true;
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.response != 'OK') {
                        console.log(xhr.response);
                        ok = false;
                    }
                };
                var cupos = [];

                for (let i=0; i < cupos_count; i++) {
                    var cupo = JSON.parse(JSON.stringify(obj));
                    cupo.id_cupo = getElementByXPath("(//table[contains(@class, 'table table-condensed')])[2]//tbody//tr[" + (i + 1) + "]//td[1]").textContent;
                    const fecha = getElementByXPath("//div[@class='date']//span").textContent;
                    cupo.fecha_cupo = new Date(month(fecha));
                    cupos.push(cupo);

                    //xhr.open('POST', 'https://greeneye.herokuapp.com/back/cupos/cupos', false);
                    xhr.open('POST', 'http://localhost:3000/back/cupos/cupos', false);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(cupo));
                }

                if (ok == true) {
                    alert('Cupos cargados!')
                } else {
                    alert('Hubo problemas!')
                }
                console.log(cupos);
            }
            box.appendChild(btn);

            //clearInterval(timer);
            urlChanged = false;
        } catch(e) {
            console.log(e);
        }
    }, 2000);
})();
