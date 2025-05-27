import { Service } from "@gpflow/di";

@Service()
export class CheckService {
    async checkServer() {
        return { status: "Server is Okay"}
    }
}