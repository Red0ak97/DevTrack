import type { Technology } from '../../entities/Technology';

const API_URL = 'http://localhost:3000/api';

export const getTechnologies = async (): Promise<Technology[]> => {
  const response = await fetch(`${API_URL}/technologies`);

  if (!response.ok) {
    throw new Error('Failed to fetch technologies');
  }

  return response.json();
};

export const deleteTechnology = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/technologies/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete technology');
  }
};

export const createTechnology = async (data: {
  name: string;
  description?: string;
}): Promise<Technology> => {
  const response = await fetch(`${API_URL}/technologies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create technology');
  }

  return response.json();
};