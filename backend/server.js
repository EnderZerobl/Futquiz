const express = require('express');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 

app.get('/api/data', (req, res) => {
    res.json({ message: 'Dados do backend Node.js!', timestamp: new Date() });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});