import type { Technology } from '../../entities/Technology';

/**
 * Фильтрует массив технологий по названию и описанию
 */
export const filterTechnologies = (
  technologies: Technology[],
  searchTerm: string
): Technology[] => {
  if (!searchTerm.trim()) {
    return technologies;
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  return technologies.filter((tech) => {
    const nameMatch = tech.name.toLowerCase().includes(normalizedSearch);
    const descriptionMatch = tech.description
      ? tech.description.toLowerCase().includes(normalizedSearch)
      : false;

    return nameMatch || descriptionMatch;
  });
};