# LLM Chatbot Application 

This repository hosts a straightforward chatbot application developed with HTML, CSS, JavaScript, and Node.js. Users can interact with the bot through a web interface, where the bot utilizes OpenAI's API to respond to queries. The application also includes a login page for user authentication.

# Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Technical report](#technical-report)
- [License](#license)

## Prerequisites

## Getting Started
s
Follow these instructions to get a copy of the project up and running on your local machine.
Prerequisites

    Node.js
    npm (Node Package Manager)
    OpenAI API key

## Installation

    Clone the repository:

    bash

### Install the dependencies:

bash

npm install

Create a .env file in the root directory and add your OpenAI API key:

env

OPENAI_API_KEY=your-openai-api-key

Start the server:

bash

    node app.js

## Usage

    Navigate to http://localhost:8080/login in your web browser.
    Use the credentials username: codigo and password: 123 to log in.
    Interact with the chatbot on the main page.


## Code Explanation
### HTML Files

    index.ejs: The main chat interface.
    login.ejs: The login page.
    home.ejs:  The chatbot page

### CSS File

    styles.css: Contains styles for both the login and chat pages.

### JavaScript File

    script.js: Handles user input, sends it to the server, and displays the bot's response.

### Server-side Code (app.js)

    Imports necessary packages like express, body-parser, cors, passport, sqlite3, and openai.
    Configures middleware for Express, including static file serving, JSON parsing, session management, and user authentication.
    Sets up routes for login, authentication, and chat interaction.
    Uses OpenAI API to generate bot responses and stores conversations in an SQLite database.

## Technical Report

## License

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
License

This project is licensed under the MIT License. See the LICENSE file for details.
