//A01641976 
const OpenAI= require("openai");  //importo la libreria de openai

const express = require('express'); //importo express
const bodyParser = require('body-parser'); //importo body-parser
const cors = require('cors');  //importo cors

const app= express(); //creo la app
const port=3000; //creo el puerto

//middelwares
app.use(cors());    //uso cors
app.use(bodyParser.json()); //uso body-parser
app.use(bodyParser.json()); //uso body-parser


require('dotenv').config();   
//esto es para que se pueda leer el archivo .env

//nueva conexion con open ai y lo voy a igualar a un objeto
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

//vamos a ir guardando toda la conversación

//función asincrona 
async function main(){

app.use(express.static('views'));
app.use(express.json());

app.listen(port, () => { //escucho el puerto
    console.log(`Server is running on port http://localhost:${port}`) //imprimo en consola
})

let history = []; //historial de la conversación

app.post('/api/chat', async (req,res)=> { 
    if(!req.body || !req.body.userQuestion){  
        return res.status(400).json({error: "Bad Request or missing request"}); 
    }

    let userQuestion = req.body.userQuestion; 

    let messages = [ {role: "user", content:userQuestion }];

    try { 
        const completion = await openai.chat.completions.create({ 
            model :"gpt-3.5-turbo", 
            messages:messages 
        });

        let botResponse = completion.choices[0].message.content; 

        history.push(messages[0]); 
        history.push({role: "bot", content: botResponse}); 

        res.json({ 
            botResponse,
            history});
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


}

main() //llamo a la función main
