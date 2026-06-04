import { useEffect, useState } from 'react';
import { getTechnologies, deleteTechnology } from '../shared/api/technologies';
import type { Technology } from '../entities/Technology';
import { CreateTechnologyForm } from './CreateTechnologyForm';

export const TechnologiesList = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const data = await getTechnologies();
      setTechnologies(data);
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту технологию?')) return;

    try {
      await deleteTechnology(id);
      setTechnologies((prev) => prev.filter((tech) => tech.id !== id));
    } catch (err) {
      alert('Не удалось удалить технологию');
      console.error(err);
    }
  };

  const handleCreateSuccess = (newTechnology: Technology) => {
    setTechnologies((prev) => [...prev, newTechnology]);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <CreateTechnologyForm onSuccess={handleCreateSuccess} />

      <h2>Список технологий</h2>

      <ul>
        {technologies.map((tech) => (
          <li key={tech.id} style={{ marginBottom: '12px' }}>
            <strong>{tech.name}</strong>
            {tech.description && <p>{tech.description}</p>}
            <button
              onClick={() => handleDelete(tech.id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};