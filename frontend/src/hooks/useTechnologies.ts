import { useState, useCallback } from 'react';
import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from '../shared/api/technologies';
import type { Technology } from '../entities/Technology';

export const useTechnologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTechnologies();
      setTechnologies(data);
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание
  const create = useCallback(async (data: { name: string; description?: string }) => {
    try {
      const newTech = await createTechnology(data);
      setTechnologies((prev) => [...prev, newTech]);
      return newTech;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Обновление
  const update = useCallback(async (id: number, data: { name: string; description?: string }) => {
    try {
      const updated = await updateTechnology(id, data);
      setTechnologies((prev) =>
        prev.map((tech) => (tech.id === id ? updated : tech))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Удаление
  const remove = useCallback(async (id: number) => {
    try {
      await deleteTechnology(id);
      setTechnologies((prev) => prev.filter((tech) => tech.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  return {
    technologies,
    loading,
    error,
    fetchTechnologies,
    create,
    update,
    remove,
  };
};