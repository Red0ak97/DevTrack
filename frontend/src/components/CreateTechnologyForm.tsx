import { useState } from 'react';

interface CreateTechnologyFormProps {
  onSuccess: (data: { name: string; description?: string }) => Promise<void>;
}

export const CreateTechnologyForm = ({ onSuccess }: CreateTechnologyFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSuccess({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Очищаем форму после успешного создания
      setName('');
      setDescription('');
    } catch (err) {
      setError('Не удалось создать технологию');
    } finally {
      setIsLoading(false);
    }
  };

  // Сбрасываем ошибку при начале ввода
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <h3>Добавить новую технологию</h3>

      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Название технологии"
          value={name}
          onChange={handleNameChange}
          disabled={isLoading}
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <textarea
          placeholder="Описание (необязательно)"
          value={description}
          onChange={handleDescriptionChange}
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