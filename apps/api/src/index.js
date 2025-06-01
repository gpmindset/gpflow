"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@/server");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const server = new server_1.Server();
server.start();
