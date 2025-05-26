import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
