import express from 'express';
const app = express(),
  port = 4000;

app
  .get('/', (req, res) => res.json({ message: 'Hello' }))
  .listen(port, () => console.log(`port: ${port} start`));
