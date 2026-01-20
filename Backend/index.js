require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./src/config/dbConfig');
const routes = require("./src/routes/index");
const helmet = require("helmet");


const app = express();
app.use(helmet());
app.use(
    cors({
      origin: "*", 
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

app.use(express.json());

connectDB();
app.use("/", routes);

app.get('/', (req, res)=>{
    res.json('node is running')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
