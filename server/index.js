const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users',       require('./routes/users'));
app.use('/api/visits',      require('./routes/visits'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/labs',        require('./routes/labs'));
app.use('/api/ai',          require('./routes/ai'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});