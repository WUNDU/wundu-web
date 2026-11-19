import type { CategoryDTO } from "../mock/category";
import CategoryItem from "./CategoryItem";

type CategoryListProps = {
  categories: CategoryDTO[];
  selectedIds?: Set<string> | string[];
  onToggle?: (category: CategoryDTO) => void;
  onSelect?: (category: CategoryDTO) => void;
};

function CategoryList({ categories, selectedIds, onToggle, onSelect }: CategoryListProps) {
  const isSelected = (id: string) =>
    Array.isArray(selectedIds)
      ? selectedIds.includes(id)
      : (selectedIds?.has(id) ?? false);

  return (
    <section
      aria-label="Categorias"
      className="flex min-h-0 w-full flex-1 flex-col items-start justify-start"
    >
      {categories.length === 0 ? (
        <p className="font-manrope text-sm text-(--text-description)">
          Nenhuma categoria encontrada.
        </p>
      ) : (
        <ul className="flex w-full flex-col items-start justify-start gap-2 self-stretch">
          {categories.map((category) => (
            <li key={category.id} className="flex flex-col self-stretch">
              <CategoryItem
                category={category}
                selected={isSelected(category.id)}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default CategoryList;
