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
  loadTable(read("detalle"));

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
  precios.forEach(element => {
    if(element.tipo===type){
      mods = element.mod;
      return;
    }
  });
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
    index = detail.indexOf(element)+1;
    th.textContent = index;
    let td1 = document.createElement("td");
    let nombre
    if(element.nombre!="full_tuning"){
      nombre = element.nombre.charAt(0).toUpperCase() + element.nombre.slice(1);
    }else{
      nombre="Full Tuning"
    }
    td1.textContent = nombre;
    let td2 = document.createElement("td");
    let precio = CLPformat(element.valor)
    td2.textContent= precio;

    tr.appendChild(th);
    tr.appendChild(td1);
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

  tr.appendChild(th);
  tr.appendChild(td1);
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