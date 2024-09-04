const express = require('express');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', './views');



app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });