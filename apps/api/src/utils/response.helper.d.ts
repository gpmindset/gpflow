import { Request, Response } from "express";
export declare function sendSuccessResponse(res: Response, data: any, raw?: boolean, responseCode?: number, responseHeader?: object): void;
export declare function send<T, R extends Request, S extends Response>(processFunction: (req: R, res: S) => Promise<T>, raw?: boolean): (req: R, res: S) => Promise<void>;
//# sourceMappingURL=response.helper.d.ts.map