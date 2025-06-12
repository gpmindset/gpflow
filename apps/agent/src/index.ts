import express from "express";
import {config} from "dotenv";
import { homedir } from "os"

config({ path: `${homedir()}/.gpflow/.gpflow.env`})

const isDev = process.env.NODE_ENV !== "production"

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`gpflow agent listening on ${PORT}`);
})
