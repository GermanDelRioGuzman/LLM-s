const index = require('./index');//import the file we are testing
require('dotenv').config();//import the dotenv package

// Test: Function 1: save message to the database
test('Function 1: save message to the database', () => {
    const result = index.saveMessage('input', 'input');//call the function we are testing
    expect(result).toBe('message saved');//check if the result is what we expect
});

//Function 2: main to start the server
test('Function 2: main', () => {
    const result = index.main();
    expect(result).toBe('Server is running on port http://localhost:3000');
});