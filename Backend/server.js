const express = require('express');
const app = express();
const PORT = 5000;


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello from Express API ');
});


app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Dhanush' },
    { id: 2, name: 'Allen' },
  ]);
});



app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
