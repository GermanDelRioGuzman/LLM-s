# LLM Chatbot Application 

This repository hosts a straightforward chatbot application developed with HTML, CSS, JavaScript, and Node.js. Users can interact with the bot through a web interface, where the bot utilizes OpenAI's API to respond to queries. The application also includes a login page for user authentication.

# Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technical report](#technical-report)
- [License](#license)

## Feautures
- User authentication: SignUp and LogIn 
- Chatbor interaction: OpenAI API
- Conversation history: SQLite DB
- Interface: user-friendly

## Prerequisites
Before you begin, ensure you have Docker installed on your system. You can download it from [Docker's website](https://www.docker.com/products/docker-desktop).

## Getting Started
To get the application up and running, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/GermanDelRioGuzman/LLM-s.git
   cd LLM-s
   ```
2. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Usage
1. Start the server:
   ```bash
   npm index.js
   ```

Navigate to http://localhost:8080/login in your web browser.
Use the credentials username: codigo and password: 123 to log in.
Interact with the chatbot on the main page.

## Technical Report
### Overall Architecture
![architecture](/DiagramaArquitectura.png)

### Overall Database
![database](/DiagramasEntidadRelacionDBs.png)

## License
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
License

This project is licensed under the MIT License. See the LICENSE file for details.
## To Dockerize the web app you need to...
create a file called docker-compose.yml and put the next code

```bash
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/usr/src/app
      - /usr/src/app_node_modules
      - ./data:/usr/src/app/data
    environment:
      NODE_ENV: development
      #put your api key here 
    command: npm start
```
and after that you could dockerize the web app 
