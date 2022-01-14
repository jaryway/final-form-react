const express = require('express');
const app = express();
const port = 1300;

// @ts-ignore
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get('/api/sleep', (req, res) => {
  sleep(30000);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
