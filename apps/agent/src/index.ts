import {config} from "dotenv";
import { homedir } from "os"

config({ path: `${homedir()}/.gpflow/.gpflow.env`})

const isDev = process.env.NODE_ENV !== "production"

// TODO: Have to implement polling to execute tasks by agent in Remote machine