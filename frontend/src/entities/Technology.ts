export interface Technology {
  id: number;
  name: string;
  description?: string;     // опциональное поле
  createdAt: string;
  updatedAt: string;
}

export const getTechnologyName = (name: string): string => {
  console.log("Функция вызвана с объектом:", name);
  return name;
};