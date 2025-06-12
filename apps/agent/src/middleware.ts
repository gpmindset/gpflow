import { Request, Response, NextFunction } from "express";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers.authorization?.split(' ')[1];
        if (!authToken) {
            res.status(401).send({})
        }

        if (authToken !== process.env.AUTH_TOKEN) {
            res.status(401).send({})
        }

        next()
    } catch (e) {
        res.status(401).send({})
    }
}

export default validateToken;