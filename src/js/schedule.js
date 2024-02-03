/*
Code used to make the entry of a worker in the "system"
*/

let btnSchedule = document.getElementById("btnGetHours");
btnSchedule.addEventListener("click",getHours);

function getHours() {
  let name = document.getElementById("workerName").value;
  if (name.length == 0){
    alert("No se ha ingresado nombre del trabajador!");
    return;
  }
  let job = document.getElementById("workerJob").value;
  if (job.length == 0){
    alert("No se ha ingresado cargo del trabajador!");
    return;
  }
  fetch('http://worldtimeapi.org/api/timezone/America/Santiago')
    .then(response => response.json())
    .then(data => {
      const horaSantiago = new Date(data.datetime);
      const hora = horaSantiago.getHours().toString().padStart(2, '0');
      const minutos = horaSantiago.getMinutes().toString().padStart(2, '0');
      // Obtener la fecha en formato DD/MM/YYYY
      const dia = horaSantiago.getDate().toString().padStart(2, '0');
      const mes = (horaSantiago.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
      const anio = horaSantiago.getFullYear();
      // Formatear la fecha
      const fechaFormateada = `${dia}/${mes}/${anio}`;
      /*
        String de Ejemplo
        Nombre: Thomas Shelby
        Fecha: 03/02/2024
        Cargo: Mecánico
        Hora de entrada: 01:15
        Hora de salida : 02:15
      */
      let scheduleStr = `Nombre: ${name}\nFecha: ${fechaFormateada}\nCargo: ${job}\nHora de entrada: ${hora}:${minutos}\nHora de salida: [Pendiente]`;
      navigator.clipboard.writeText(scheduleStr)
        .then(function () {
          cleanEntryInputs();
          alert("Recuerda enviar tu horario por discord!");
        });
    })
    .catch(error => console.error('Error al obtener la hora:', error));
}

function cleanEntryInputs(){
  document.getElementById("workerName").value = "";
  document.getElementById("workerJob").value = "";
}