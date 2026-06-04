import { useEffect, useState } from 'react';
import { getTechnologies, deleteTechnology } from '../shared/api/technologies';
import type { Technology } from '../entities/Technology';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import { EditTechnologyModal } from './EditTechnologyModal';

export const TechnologiesList = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние модалки редактирования
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);

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

  // Открыть модалку редактирования
  const openEditModal = (tech: Technology) => {
    setSelectedTechnology(tech);
    setIsEditModalOpen(true);
  };

  // Закрыть модалку
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTechnology(null);
  };

  // После успешного обновления
  const handleUpdateSuccess = (updatedTechnology: Technology) => {
    setTechnologies((prev) =>
      prev.map((tech) => (tech.id === updatedTechnology.id ? updatedTechnology : tech))
    );
    closeEditModal();
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
            <button onClick={() => openEditModal(tech)} style={{ marginLeft: '10px' }}>
              Редактировать
            </button>
            <button
              onClick={() => handleDelete(tech.id)}
              style={{ marginLeft: '8px', color: 'red' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      {/* Модалка редактирования */}
      <EditTechnologyModal
        technology={selectedTechnology}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};