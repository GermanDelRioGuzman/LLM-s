// Selecciona el botón, el input y el div de chat box
var button = document.querySelector('.input-box button');
var input = document.querySelector('.input-box input');
var chatBox = document.querySelector('.chat-box');

button.addEventListener('click', function () {
    var inputValue = input.value;
    if (inputValue.trim() === '') return;  // Evita enviar mensajes vacíos

    // Muestra el mensaje del usuario en la interfaz
    var userMessage = document.createElement('div');
    userMessage.textContent = inputValue;
    userMessage.className = 'sent';  // Añade una clase para estilos
    chatBox.appendChild(userMessage);

    // Haz la solicitud POST
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userQuestion: inputValue })
    })
        .then(response => response.json())
        .then(data => {
            // Muestra la respuesta del bot
            var botMessage = document.createElement('div');
            botMessage.textContent = data.botResponse;  // Accede correctamente a la respuesta
            botMessage.className = 'received';  // Añade una clase para estilos
            chatBox.appendChild(botMessage);
        })
        .catch(error => console.error('Error:', error));  // Añade manejo de errores

    // Limpia el input
    input.value = '';
});