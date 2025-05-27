import { Request, Response } from "express";
import { Readable } from "node:stream"

export function sendSuccessResponse(
	res: Response,
	data: any,
	raw?: boolean,
	responseCode?: number,
	responseHeader?: object,
) {
	if (responseCode !== undefined) {
		res.status(responseCode);
	}

	if (responseHeader) {
		res.header(responseHeader);
	}

	if (data instanceof Readable) {
		data.pipe(res);
		return;
	}

	if (raw === true) {
		if (typeof data === 'string') {
			res.send(data);
		} else {
			res.json(data);
		}
	} else {
		res.json({
			data,
		});
	}
}

export function send<T, R extends Request, S extends Response>(
    processFunction: (req: R, res: S) => Promise<T>,
    raw = false
) {

    return async(req: R, res: S): Promise<void> => {
        try {
            const data = await processFunction(req, res)

            if(!res.headersSent) sendSuccessResponse(res, data, raw)
        } catch (error) {
            
        }
    }

}


