import { useState } from 'react';
import { validateTechnology } from '../shared/utils/validation';

interface CreateTechnologyFormProps {
  onSuccess: (data: { name: string; description?: string }) => Promise<void>;
}

export const CreateTechnologyForm = ({ onSuccess }: CreateTechnologyFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // только для ошибок сервера

  const validationErrors = validateTechnology({ name, description });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationErrors.name) {
      return; // не отправляем форму, если есть ошибка в названии
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await onSuccess({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName('');
      setDescription('');
    } catch (err) {
      setServerError('Не удалось создать технологию');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
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
        {validationErrors.name && (
          <p style={{ color: 'red', marginTop: '4px', marginBottom: '0' }}>
            {validationErrors.name}
          </p>
        )}
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
        {validationErrors.description && (
          <p style={{ color: 'red', marginTop: '4px', marginBottom: '0' }}>
            {validationErrors.description}
          </p>
        )}
      </div>

      {serverError && (
        <p style={{ color: 'red', marginBottom: '8px' }}>{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !!validationErrors.name}
      >
        {isLoading ? 'Добавление...' : 'Добавить технологию'}
      </button>
    </form>
  );
};