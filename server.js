const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dashboard-4c17a-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
app.use(express.json())
app.get('/clientes', async (req, res) => {
  try {
    const clientesRef = firestore.collection('clientes');
    const snapshot = await clientesRef.get();
    const clientes = snapshot.docs.map(doc => ({ id: doc.id }));
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
    res.status(201).json({ id: clienteRef.id });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
});

app.put('/clientes/:bairros', async (req, res) => {
  try {
    const bairros = req.params.bairros;
    const novosDadosCliente = req.body;
    const clienteRef = firestore.collection('clientes').doc(bairros);
    await clienteRef.update(novosDadosCliente);
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro ao atualizar cliente" });
  }
});

app.delete('/clientes/:bairros', async (req, res) => {
  try {
    const bairros = req.params.bairros;
    const clienteRef = firestore.collection('clientes').doc(bairros);
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
