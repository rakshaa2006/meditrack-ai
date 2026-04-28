const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/visits',      require('./routes/visits'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/labs',        require('./routes/labs'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});