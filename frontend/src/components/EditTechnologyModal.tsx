import { useState, useEffect } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (technology) {
      setName(technology.name);
      setDescription(technology.description || '');
      setError(null);
    }
  }, [technology]);

  if (!isOpen || !technology) return null;

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
      onClose();
    } catch (err) {
      setError('Не удалось обновить технологию');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (error) setError(null);
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
          </div>

          {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Отмена
            </button>
            <button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};