import { useState } from 'react';
import { createTechnology } from '../shared/api/technologies';
import type { Technology } from '../entities/Technology';

interface CreateTechnologyFormProps {
  onSuccess: (newTechnology: Technology) => void;
}

export const CreateTechnologyForm = ({ onSuccess }: CreateTechnologyFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }

    setIsLoading(true);
    setError(null);

    createTechnology({
      name: name.trim(),
      description: description.trim() || undefined,
    })
      .then((newTechnology) => {
        onSuccess(newTechnology);
        setName('');
        setDescription('');
      })
      .catch((err) => {
        setError('Не удалось создать технологию');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <h3>Добавить новую технологию</h3>

      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Название технологии"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <textarea
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          rows={3}
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}

      <button type="submit" disabled={isLoading || !name.trim()}>
        {isLoading ? 'Добавление...' : 'Добавить технологию'}
      </button>
    </form>
  );
};