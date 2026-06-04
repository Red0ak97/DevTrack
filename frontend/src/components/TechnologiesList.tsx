import { useEffect, useState } from 'react';
import type { Technology } from '../entities/Technology';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import { EditTechnologyModal } from './EditTechnologyModal';
import { useTechnologies } from '../hooks/useTechnologies';

export const TechnologiesList = () => {
  const { technologies, loading, error, fetchTechnologies, create, update, remove } =
    useTechnologies();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту технологию?')) return;

    try {
      await remove(id);
    } catch (err) {
      alert('Не удалось удалить технологию');
    }
  };

  const handleCreateSuccess = async (data: { name: string; description?: string }) => {
    try {
      await create(data);
    } catch (err) {
      alert('Не удалось создать технологию');
    }
  };

  const openEditModal = (tech: Technology) => {
    setSelectedTechnology(tech);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTechnology(null);
  };

  const handleUpdateSuccess = async (data: { name: string; description?: string }) => {
    if (!selectedTechnology) return;

    try {
      await update(selectedTechnology.id, data);
      closeEditModal();
    } catch (err) {
      alert('Не удалось обновить технологию');
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

      <EditTechnologyModal
        technology={selectedTechnology}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};