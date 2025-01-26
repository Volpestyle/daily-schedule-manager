import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Category, DefaultCategories } from '@/types/schedule';

interface CategorySelectProps {
  currentCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const categories = Object.entries(DefaultCategories);

export const CategorySelect: React.FC<CategorySelectProps> = ({
  currentCategories,
  onCategoriesChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0][0] as Category);

  const handleAddCategory = () => {
    if (!currentCategories.includes(selectedCategory)) {
      onCategoriesChange([...currentCategories, selectedCategory]);
    }
  };

  const handleRemoveCategory = (categoryToRemove: Category) => {
    onCategoriesChange(currentCategories.filter((cat) => cat !== categoryToRemove));
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Categories</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {currentCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md">
            <span>{DefaultCategories[cat as keyof typeof DefaultCategories]}</span>
            <button
              type="button"
              onClick={() => handleRemoveCategory(cat)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <select
          className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category)}
        >
          {categories.map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={handleAddCategory} className="shrink-0">
          Add Category
        </Button>
      </div>
    </div>
  );
};
