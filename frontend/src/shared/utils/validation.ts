export interface TechnologyValidationErrors {
  name?: string;
  description?: string;
}

/** Валидация названия технологии */
export const validateTechnologyName = (name: string): string | null => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'Название обязательно';
  }

  if (trimmedName.length < 3) {
    return 'Название должно содержать минимум 3 символа';
  }

  return null;
};

/** Валидация описания технологии */
export const validateTechnologyDescription = (description: string): string | null => {
  const trimmed = description.trim();

  if (trimmed.length > 500) {
    return 'Описание не должно превышать 500 символов';
  }

  return null;
};

/** Общая валидация технологии */
export const validateTechnology = (data: {
  name: string;
  description?: string;
}): TechnologyValidationErrors => {
  const errors: TechnologyValidationErrors = {};

  const nameError = validateTechnologyName(data.name);
  if (nameError) {
    errors.name = nameError;
  }

  const descriptionError = validateTechnologyDescription(data.description || '');
  if (descriptionError) {
    errors.description = descriptionError;
  }

  return errors;
};