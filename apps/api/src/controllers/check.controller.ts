import { Get, Param, RestController } from "@gpflow/decorators";
import { CheckService } from "@/services/check.service";
import type { Request, Response } from "express";

@RestController("/check")
export class CheckController {
    constructor(
        private checkService: CheckService
    ){}

    @Get("/:check")
    async checkServer(_req: Request, _res: Response, @Param('check') check: string){
        console.log(check)
        return await this.checkService.checkServer()
    }
}