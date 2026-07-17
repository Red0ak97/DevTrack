import { useEffect, useState, useMemo} from 'react';
import type { Technology } from '../entities/Technology';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import { EditTechnologyModal } from './EditTechnologyModal';
import { useTechnologies } from '../hooks/useTechnologies';
import { filterTechnologies } from '../shared/utils/filterTechnologies';

export const TechnologiesList = () => {
  const { technologies, loading, error, fetchTechnologies, create, update, remove } =
    useTechnologies();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300); // задержка 300 мс

  return () => {
    clearTimeout(timer); // очищаем таймер при каждом новом вводе
  };
  }, [searchTerm]);

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

  const filteredTechnologies = useMemo(() => {
  return filterTechnologies(technologies, debouncedSearchTerm);
}, [technologies, debouncedSearchTerm]);


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <CreateTechnologyForm onSuccess={handleCreateSuccess} />

      <h2>Список технологий</h2>

    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '300px', padding: '8px' }}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          style={{ padding: '8px 12px' }}
        >
          Очистить
        </button>
      )}
    </div>

      {filteredTechnologies.length === 0 ? (
  <p style={{ color: '#666', marginTop: '16px' }}>
    {searchTerm.trim() 
      ? 'Ничего не найдено по вашему запросу' 
      : 'Список технологий пуст'}
  </p>
) : (
  <ul>
    {filteredTechnologies.map((tech) => (
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
)}

      <EditTechnologyModal
        technology={selectedTechnology}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};