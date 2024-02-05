let btnKitsCopy = document.getElementById("btnKitsCopy");
btnKitsCopy.addEventListener("click",makeKitsBill);
function makeKitsBill(){
  let name = document.getElementById("clientNamekts").value;
  if (name.length==0){
    alert("No se a ingresado el nombre del cliente!");
    return;
  }
  let hour = document.getElementById("orderHour").value;
  if (hour.length==0){
    alert("No haz ingresado la hora de atencion!");
    return;
  }

  /*
    Example string of kit bill
    Venta de kits 3x $345.000
    Nombre IC: Jordan Diaz 
    Hora:22:50
  */
  let bill = `Venta de kits 3x $345.000\nNombre IC: ${name}\nHora: ${hour}`;
  navigator.clipboard.writeText(bill)
        .then(function () {
          cleanUpKitsInputs();
          alert("Recuerda enviar la venta por discord!");
        });
}

function cleanUpKitsInputs(){
  document.getElementById("clientNamekts").value="";
  document.getElementById("orderHour").value="";
}