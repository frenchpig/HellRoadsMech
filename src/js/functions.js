precios = [ {tipo: "concesionario", mod: [ {nombre: "motor", valor: 446400},
                                          {nombre: "frenos", valor: 260000},
                                          {nombre: "suspension", valor: 408000},
                                          {nombre: "trasmision", valor: 320000},
                                          {nombre: "turbo", valor: 360000},
                                          {nombre: "full_tuning", valor: 3200000},
                                          {nombre: "estetico", valor: 120000}]},
            {tipo: "moto",          mod: [ {nombre: "motor", valor: 400000},
                                          {nombre: "frenos", valor: 200000},
                                          {nombre: "suspension", valor: 320000},
                                          {nombre: "trasmision", valor: 240000},
                                          {nombre: "turbo", valor: 280000},
                                          {nombre: "full_tuning", valor:  2800000},
                                          {nombre: "estetico", valor: 120000}]},
            {tipo: "camioneta",     mod: [ {nombre: "motor", valor: 640000},
                                          {nombre: "frenos", valor: 400000},
                                          {nombre: "suspension", valor: 520000},
                                          {nombre: "trasmision", valor: 440000},
                                          {nombre: "turbo", valor: 480000},
                                          {nombre: "full_tuning", valor: 7200000},
                                          {nombre: "estetico", valor: 240000}]},
            {tipo: "donador",       mod: [ {nombre: "motor", valor: 1840000},
                                          {nombre: "frenos", valor: 1920000},
                                          {nombre: "suspension", valor: 2240000},
                                          {nombre: "trasmision", valor: 2080000},
                                          {nombre: "turbo", valor: 2120000},
                                          {nombre: "full_tuning", valor: 14400000},
                                          {nombre: "estetico", valor: 400000}]},
            {tipo: "deportivo",     mod: [ {nombre: "motor", valor: 960000},
                                          {nombre: "frenos", valor: 1040000},
                                          {nombre: "suspension", valor: 1440000},
                                          {nombre: "trasmision", valor: 1200000},
                                          {nombre: "turbo", valor: 1216000},
                                          {nombre: "full_tuning", valor: 11200000},
                                          {nombre: "estetico", valor: 280000}]}
]
// Precios extra
extra =         [ {nombre: "kits", valor: 345000},
                  {nombre: "reparacion_taller", valor: 250000},
                  {nombre: "reparacion_ciudad", valor: 500000},
                  {nombre: "reparacion_fuera ciudad", valor: 350000}]
//helper functions
function read (key){
  let file = localStorage.getItem(key);
  if (file) {
    let array = JSON.parse(file);
    return array;
  }else {
    let json = JSON.stringify([]);
    localStorage.setItem(key, json);
    return []
  }
}

function save (key, array){
  let json = JSON.stringify(array);
  localStorage.setItem(key,json);
}

document.addEventListener("DOMContentLoaded", function(){
  clearDetail();

  let select = document.getElementById("typeselect");
  select.addEventListener("change", function(event){
    clearDetail();
  })
});

/*
  Local Storage Utilizados:
  detalle: se utiliza para guardar el detalle de la factura.
*/
let modbtns = document.querySelectorAll('.modbtn');
modbtns.forEach(function(element) {
  element.addEventListener('click', function(){
    id = element.id.slice(0,-3);
    addToDetail(id);
  });
});

function addToDetail(modification){
  let select = document.getElementById("typeselect");
  type=select.value;
  if (modification!="reparacion_taller"&&type=="0"){
    alert("Debe seleccionar un tipo de vehiculo");
    return;
  }
  let mods;
  if(modification=="reparacion_taller"){
    mods=extra;
  }else{
    precios.forEach(element => {
      if(element.tipo===type){
        mods = element.mod;
        return;
      }
    });
  }
  
  let detail;
  mods.forEach(element=> {
    if(element.nombre===modification){
      detail=element
    }
  });

  let bill = read("detalle");
  let state = true;
  bill.forEach(element => {
    if(element.nombre===detail.nombre&&element.nombre!="estetico"){
      
      state = false;
      return;
    }
  });

  if (!state){
    alert("No se puede agregar mas modificaciones de este tipo");
    return;
  }

  if(bill.length!=0&&bill[0].nombre==="full_tuning"){
    alert("El vehiculo ya se le esta haciendo full tuning!");
    return;
  }

  if(detail.nombre=="full_tuning"){
    bill=[];
    bill.push(detail)
    save("detalle",bill);
  } else {
    bill.push(detail);
    save("detalle",bill);
  }

  loadTable(bill);
}

function loadTable(detail){
  cleanTable()
  /* 
    <tr>
      <th scope="row">1</th>
      <td>Reparacion</td>
      <td>$250.000</td>
    </tr>
  */
  let body = document.getElementById("tablebody");
  let total = 0;
  detail.forEach(element => {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope","row");
    index = detail.indexOf(element);
    th.textContent = index + 1;
    let td1 = document.createElement("td");
    let nombre;
    if(element.nombre!="full_tuning"&&element.nombre!="reparacion_taller"){
      nombre = element.nombre.charAt(0).toUpperCase() + element.nombre.slice(1);
    }else if (element.nombre=="full_tuning") {
      nombre="Full Tuning";
    } else if (element.nombre=="reparacion_taller"){
      nombre="Reparacion en Taller";
    }
    td1.textContent = nombre;
    let td2 = document.createElement("td");
    let precio = CLPformat(element.valor)
    td2.textContent= precio;

    let td3 = document.createElement("td");
    let btndelete = document.createElement("a");
    btndelete.classList.add("btn", "btn-danger", "btndelete");
    btndelete.id = "btndelete"+index;
    btndelete.innerHTML = 'Eliminar';
    btndelete.addEventListener("click", function(event){
      let id = event.target.getAttribute("id");
      deleteFromDetail(id);
    });
    td3.appendChild(btndelete)

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td3);
    tr.appendChild(td2);

    body.appendChild(tr);
    total += element.valor;

  });
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.setAttribute("scope","row");
  let td1 = document.createElement("td");
  td1.textContent = "Total:";
  td1.classList.add("fw-bold");
  let td2 = document.createElement("td");
  let precio = CLPformat(total)
  td2.textContent= precio;
  let td3 = document.createElement("td");

  tr.appendChild(th);
  tr.appendChild(td1);
  tr.appendChild(td3);
  tr.appendChild(td2);

  body.appendChild(tr);
}

function cleanTable() {
  var tbody = document.getElementById("tablebody");
  while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
  }
}

function clearDetail(){
  save("detalle",[]);
  loadTable(read("detalle"));
}

function CLPformat (number) {
  var formatedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$"+formatedNumber
}

function deleteFromDetail(id){
  let curatedID = id.replace(/\D/g, "");
  console.log(curatedID);
  let detail = read("detalle");
  detail.splice(curatedID,1);
  loadTable(detail);
  save("detalle",detail);
}

function billMaker(){
  //clientName vehicleTag
  let name = document.getElementById("clientName").value;
  if (name.length == 0) {
    alert("Faltan datos del cliente");
    return;
  }
  let tag = document.getElementById("vehicleTag").value;
  let type = document.getElementById("typeselect").value;
  if (tag.length == 0 || type=="0") {
    alert("Faltan datos del vehiculo");
    return;
  }

  let bill = read("detalle");
  if (bill.length == 0){
    alert("No se han realizado modificaciones");
    return;
  }
  let total = 0;
  let modStr = '';
  let esteticoCounter = 0;

  bill.forEach(element => {
    total += element.valor
    if (element.nombre!="estetico"&&element.nombre!="full_tuning"&&element.nombre!="reparacion_taller") {
      modStr = modStr + ", " + element.nombre.charAt(0).toUpperCase() + element.nombre.slice(1);
    }else if (element.nombre!="estetico"&&element.nombre=="full_tuning"&&element.nombre!="reparacion_taller") {
      modStr = ", Full Tuning";
    }else if (element.nombre!="estetico"&&element.nombre!="full_tuning"&&element.nombre=="reparacion_taller"){
      modStr = modStr + ", Reparacion";
    }
    if (element.nombre=="estetico") {
      esteticoCounter += 1;
    }
  });
  modStr = modStr.substring(2);
  if (esteticoCounter>1){
    modStr = modStr + ", " + esteticoCounter + " Esteticos"
  }
  if(esteticoCounter==1){
    modStr = modStr + ", " + esteticoCounter + " Estetico"
  }

  modStr = modStr + " " + CLPformat(total)
  type = type.charAt(0).toUpperCase() + type.slice(1);

  let printedbill = `➥ 𝗡𝗼𝗺𝗯𝗿𝗲 𝗜𝗖: ${name}\n ➥ 𝗧𝗶𝗽𝗼 𝗱𝗲 𝗺𝗼𝗱𝗶𝗳𝗶𝗰𝗮𝗰𝗶𝗼𝗻 𝘆 𝗽𝗿𝗲𝗰𝗶𝗼 : ${modStr}\n➥ 𝗠𝗼𝗱𝗲𝗹𝗼 𝗩𝗲𝗵𝗶𝗰𝘂𝗹𝗼 : ${type}\n➥ 𝗣𝗮𝘁𝗲𝗻𝘁𝗲 𝗩𝗲𝗵𝗶𝗰𝘂𝗹𝗼: ${tag}`;

  navigator.clipboard.writeText(printedbill)
    .then(function(){
      cleaner();
      alert("Factura copiada en el portapapeles!");
    });

  console.log(name);
  console.log(tag);
  console.log(modStr);
  console.log(type);
  console.log(printedbill);

}

function cleaner(){
  document.getElementById("typeselect").selectedIndex = 0;
  document.getElementById("clientName").value = "";
  document.getElementById("vehicleTag").value = "";
  clearDetail();
}