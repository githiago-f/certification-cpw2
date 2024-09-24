import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

const criaDespesa = z.object({
    valor: z.number({ coerce: true }).gte(0.01).transform(n => Number((n * 100).toFixed(0))),
    nome: z.string().min(3),
});

/**
 * @param {import('@prisma/client').Despesa} obj
 * @returns {{valor: number, id: number, nome: string}}
 */
const mapDespesa = (obj) => ({
    valor: Number((obj.valor / 100).toFixed(2)),
    nome: obj.nome,
    id: obj.id
});

app.get('/despesas', async (req, res) => {
    const despesas = await prisma.despesa.findMany();

    res.status(200).json({
        content: despesas.map(mapDespesa)
    });
});

app.get('/despesas/total', async (req, res) => {
    const [row] = await prisma.$queryRaw`SELECT sum(valor) as total FROM Despesa`;
    res.status(200).json({ total: Number((Number(row.total ?? 0) / 100).toFixed(2)) });
});

app.post('/despesas', async (req, res) => {
    try {
        const despesaRequest = criaDespesa.parse(req.body);
        const despesa = await prisma.despesa.create({ data: despesaRequest});
        res.status(201).json({ despesa: mapDespesa(despesa) });
    } catch(e) {
        res.status(422).json(e.errors);
    }
});

app.listen(3000);
