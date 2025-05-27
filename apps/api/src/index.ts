import { Server } from "@/server";
import { config } from "dotenv"

config() 

const server = new Server()
server.start()


