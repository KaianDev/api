import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from "../services/auth";

export const login: RequestHandler = (req, res) => {
    const loginSchema = z.object({
        password: z.string(),
    });

    const body = loginSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "Dados inválidos" });

    if (!auth.validatePassword(body.data.password)) {
        console.log("Erro aqui");
        return res.status(403).json({ error: "Acesso negado" });
    }

    const token = auth.getToken();
    console.log(token);

    res.json({ token });
};

export const validate: RequestHandler = (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(403).json({ error: "Acesso negado" });

    const token = req.headers.authorization.split(" ")[1];

    if (!auth.validateToken(token))
        return res.status(403).json({ error: "Acesso negado" });

    next();
};
