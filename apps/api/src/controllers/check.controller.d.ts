import { CheckService } from "@/services/check.service";
import type { Request, Response } from "express";
export declare class CheckController {
    private checkService;
    constructor(checkService: CheckService);
    checkServer(_req: Request, _res: Response, check: string): Promise<{
        status: string;
    }>;
}
//# sourceMappingURL=check.controller.d.ts.map