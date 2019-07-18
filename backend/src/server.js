require('dotenv').config(); 
const express = require('express'); // Micro framework que ajuda a lidar com requisições (rotas)
const mongoose = require('mongoose'); // Abstrair o banco de dados e permite lidar com apenas código js
const cors = require('cors');

const app = express();
const server = require('http').Server(app);

mongoose.connect(process.env.MONGOOSE_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true
});

app.use(cors());
app.use(express.json()); // ajuda a entender as informações em formato json
app.use(require('./routes.js')); // Para poder utilizar o arquivo de rotas

server.listen(process.env.PORT || 3333);
console.log('Back-end funcionando na porta:',(process.env.PORT || 3333));