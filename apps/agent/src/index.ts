import express from "express";
import {config} from "dotenv";
import {pinoHttp} from "pino-http";

config()

const isDev = process.env.NODE_ENV !== "production"

const app = express();

const PORT = process.env.PORT || 3000;

const httpLogger = pinoHttp({
    transport: isDev
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                singleLine: false,
                ignore: 'pid,hostname'
            },
        }
        : undefined,
    redact: {
        paths: ["req.headers.authorization", "req.body.password"],
        censor: "[REDACTED]",
    },
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
                params: req.params,
                query: req.query,
                body: req.body,
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    }
});


app.use(express.json());
app.use(httpLogger)

app.listen(PORT, () => {
    console.log(`gpflow agent listening on ${PORT}`);
})
