//Creamos una instacia de socket.io desde el lado del cliente
const socket = io();

//Creamos una variable para guardar el usuario.
let user;
const chatBox = document.getElementById("chatBox");

//Utilizamos Sweet alert para el mensaje de bienvenida
//Swall es un objeto global que nos permite usar los métdos de la librería.
//Fire es un método que nos permite configurar el alerta

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})

//Envio de mensajes 

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //Trim quita los espacios ya sea al inicio o al final 
            //El mensaje tiene que ser mayor a 0 para ser enviado 
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})


//listerner

socket.on("messagesLogs", data => {
    const log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( (message) => {
        messages = messages + `${message.user}: ${message.message} <br>`
    })
        log.innerHTML = messages;
})