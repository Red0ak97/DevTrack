import { useEffect, useState } from 'react';
import { getTechnologies, deleteTechnology, updateTechnology } from '../shared/api/technologies';
import type { Technology } from '../entities/Technology';
import { CreateTechnologyForm } from './CreateTechnologyForm';

export const TechnologiesList = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Для редактирования
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  // Начать редактирование
  const startEditing = (tech: Technology) => {
    setEditingId(tech.id);
    setEditName(tech.name);
    setEditDescription(tech.description || '');
  };

  // Отменить редактирование
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  // Сохранить изменения
  const handleUpdate = async (id: number) => {
    if (!editName.trim()) {
      alert('Название обязательно');
      return;
    }

    try {
      const updated = await updateTechnology(id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });

      setTechnologies((prev) =>
        prev.map((tech) => (tech.id === id ? updated : tech))
      );

      cancelEditing();
    } catch (err) {
      alert('Не удалось обновить технологию');
      console.error(err);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <CreateTechnologyForm onSuccess={handleCreateSuccess} />

      <h2>Список технологий</h2>

      <ul>
        {technologies.map((tech) => (
          <li key={tech.id} style={{ marginBottom: '16px' }}>
            {editingId === tech.id ? (
              // Режим редактирования
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '250px', padding: '6px', marginRight: '8px' }}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  style={{ width: '250px', padding: '6px', marginRight: '8px' }}
                />
                <button onClick={() => handleUpdate(tech.id)}>Сохранить</button>
                <button onClick={cancelEditing} style={{ marginLeft: '8px' }}>
                  Отмена
                </button>
              </div>
            ) : (
              // Обычный режим просмотра
              <div>
                <strong>{tech.name}</strong>
                {tech.description && <p>{tech.description}</p>}
                <button onClick={() => startEditing(tech)} style={{ marginLeft: '10px' }}>
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(tech.id)}
                  style={{ marginLeft: '8px', color: 'red' }}
                >
                  Удалить
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};