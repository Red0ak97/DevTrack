import { useState, useEffect } from 'react';
import { validateTechnology } from '../shared/utils/validation';

interface Technology {
  id: number;
  name: string;
  description?: string;
}

interface EditTechnologyModalProps {
  technology: Technology | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { name: string; description?: string }) => Promise<void>;
}

export const EditTechnologyModal = ({
  technology,
  isOpen,
  onClose,
  onSuccess,
}: EditTechnologyModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validationErrors = validateTechnology({ name, description });

  useEffect(() => {
    if (technology) {
      setName(technology.name);
      setDescription(technology.description || '');
      setServerError(null);
    }
  }, [technology]);

  if (!isOpen || !technology) return null;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (validationErrors.name) {
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await onSuccess({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setServerError('Не удалось обновить технологию');
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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Редактировать технологию</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Название</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={isLoading}
              style={{ width: '100%', padding: '8px' }}
            />
            {validationErrors.name && (
              <p style={{ color: 'red', marginTop: '4px', marginBottom: '0' }}>
                {validationErrors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Описание</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              disabled={isLoading}
              rows={3}
              style={{ width: '100%', padding: '8px' }}
            />
            {validationErrors.description && (
              <p style={{ color: 'red', marginTop: '4px', marginBottom: '0' }}>
                {validationErrors.description}
              </p>
            )}
          </div>

          {serverError && (
            <p style={{ color: 'red', marginBottom: '12px' }}>{serverError}</p>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || !!validationErrors.name}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};