import { NavigationItem } from './NavigationItem';
import type { NavigationCategoryConfig, NavigationItem as NavigationItemType } from '../../types/navigation';
import type { FeatureFlags } from '../../types/environment';

interface CategorySectionProps {
  category: NavigationCategoryConfig;
  items: NavigationItemType[];
  currentView: string;
  features: FeatureFlags;
  onItemClick: (item: NavigationItemType) => void;
  showTooltips: boolean;
}

export function CategorySection({ 
  category, 
  items, 
  currentView, 
  features, 
  onItemClick, 
  showTooltips 
}: CategorySectionProps) {
  if (items.length === 0) {
    return null;
  }

  const enabledCount = items.filter(item => item.isEnabled(features)).length;
  const totalCount = items.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span aria-hidden="true">{category.icon}</span>
          {category.label}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {enabledCount}/{totalCount}
          </span>
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (enabledCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mb-3">{category.description}</p>
      
      <div className="space-y-1">
        {items.map(item => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={currentView === item.id}
            isEnabled={item.isEnabled(features)}
            onClick={() => onItemClick(item)}
            showTooltips={showTooltips}
          />
        ))}
      </div>
    </div>
  );
}