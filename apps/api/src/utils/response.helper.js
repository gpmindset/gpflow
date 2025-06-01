"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = sendSuccessResponse;
exports.send = send;
const node_stream_1 = require("node:stream");
function sendSuccessResponse(res, data, raw, responseCode, responseHeader) {
    if (responseCode !== undefined) {
        res.status(responseCode);
    }
    if (responseHeader) {
        res.header(responseHeader);
    }
    if (data instanceof node_stream_1.Readable) {
        data.pipe(res);
        return;
    }
    if (raw === true) {
        if (typeof data === 'string') {
            res.send(data);
        }
        else {
            res.json(data);
        }
    }
    else {
        res.json({
            data,
        });
    }
}
function send(processFunction, raw = false) {
    return async (req, res) => {
        try {
            const data = await processFunction(req, res);
            if (!res.headersSent)
                sendSuccessResponse(res, data, raw);
        }
        catch (error) {
        }
    };
}
