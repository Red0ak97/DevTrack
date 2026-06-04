import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const technologies = await prisma.technology.findMany();
  res.json(technologies);
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;

  const newTechnology = await prisma.technology.create({
    data: {
      name,
      description,
    },
  });

  res.status(201).json(newTechnology);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await prisma.technology.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(204).send();
});

// Обновить технологию
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updatedTechnology = await prisma.technology.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      description,
    },
  });

  res.json(updatedTechnology);
});

export default router;