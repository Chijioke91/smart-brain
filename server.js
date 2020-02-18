const express = require('express');
const cors = require('cors');
const allRoute = require('./routes/route');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', allRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is up on port ${PORT}`));
