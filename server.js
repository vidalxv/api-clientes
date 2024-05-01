const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

const serviceAccount = require("./serviceAccountKey.json");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dashboard-4c17a-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
app.use(express.json())
app.get('/clientes', async (req, res) => {
  try {
    const clientesRef = firestore.collection('clientes');
    const querySnapshot = await clientesRef.get();

    const clientes = [];
    querySnapshot.forEach(doc => {
      const dadosCliente = doc.data();
      const cliente = {
        id: doc.id,
        ...dadosCliente
      };
      clientes.push(cliente);
    });

    res.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
});

app.post('/clientes', async (req, res) => {
  try {
    console.log(req.body);
    const novoCliente = req.body;
    const clienteRef = await firestore.collection('clientes').add(novoCliente);

    const doc = await clienteRef.get();
    const dadosCliente = doc.data();

    const cliente = {
      id: doc.id,
      ...dadosCliente
    };

    res.status(201).json(cliente);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
});


app.put('/clientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const novosDadosCliente = req.body;
    const clienteRef = firestore.collection('clientes').doc(id);

    await clienteRef.update(novosDadosCliente);

    const doc = await clienteRef.get();
    const dadosCliente = doc.data();

    const cliente = {
      id: doc.id,
      ...dadosCliente
    };

    res.json(cliente);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro ao atualizar cliente" });
  }
});


app.delete('/clientes/:clienteId', async (req, res) => {
  const clienteId = req.params.clienteId;
  try {
    const clienteRef = firestore.collection('clientes').doc(clienteId);
    await clienteRef.delete();
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ message: "Erro ao excluir cliente" });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
