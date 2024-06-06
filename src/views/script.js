//This file is used to send the user's question to the server and receive the bot's response to display it in the chat interface.
var button = document.querySelector('.input-box button');
var input = document.querySelector('.input-box input');
var chatBox = document.querySelector('.chat-box');

button.addEventListener('click', function () {
    var inputValue = input.value;
    if (inputValue.trim() === '') return;  //Stops the function if the input is empty

    // Show the user message in the chat box
    var userMessage = document.createElement('div');
    userMessage.textContent = inputValue;
    userMessage.className = 'sent';  //Add a class to style the message differently 
    chatBox.appendChild(userMessage);

    // Do a POST request to the server with the user question and get the bot response back
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userQuestion: inputValue })
    })
        .then(response => response.json())
        .then(data => {
            // Show the bot response in the chat box
            var botMessage = document.createElement('div');
            botMessage.textContent = data.botResponse;  //Add the bot response to the message element
            botMessage.className = 'received';  //Add a class to style the message differently 
            chatBox.appendChild(botMessage);
        })
        .catch(error => console.error('Error:', error));  //Add an error message if the request fails 

    //Clear the input field after sending the message
    input.value = '';
});