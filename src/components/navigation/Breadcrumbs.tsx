import { NavigationService } from '../../services/navigation';
import { getFeatureFlags } from '../../config/environment';

interface BreadcrumbsProps {
  currentView: string;
  onNavigate: (path: string, viewName: string) => void;
}

export function Breadcrumbs({ currentView, onNavigate }: BreadcrumbsProps) {
  const features = getFeatureFlags();
  const allItems = NavigationService.getAllNavigationItems();
  const currentItem = allItems.find(item => item.id === currentView);

  if (!currentItem) {
    return null;
  }

  const breadcrumbs = [
    { label: 'Home', path: '/', id: 'home' },
  ];

  // Add category if not in core
  if (currentItem.category !== 'core') {
    const categoryLabel = NavigationService.getCategoryLabel(currentItem.category);
    const categoryIcon = NavigationService.getCategoryIcon(currentItem.category);
    
    breadcrumbs.push({
      label: `${categoryIcon} ${categoryLabel}`,
      path: `/${currentItem.category}`,
      id: currentItem.category
    });
  }

  // Add current page
  breadcrumbs.push({
    label: `${currentItem.icon} ${currentItem.label}`,
    path: currentItem.path,
    id: currentItem.id
  });

  const handleBreadcrumbClick = (breadcrumb: any) => {
    if (breadcrumb.id === 'home') {
      onNavigate('/', 'journal');
    } else if (breadcrumb.id === currentItem.category) {
      // Navigate to first item in category
      const categoryItems = NavigationService.getNavigationItemsByCategory(currentItem.category, features);
      const firstItem = categoryItems.find(item => item.isEnabled(features));
      if (firstItem) {
        onNavigate(firstItem.path, firstItem.id);
      }
    } else {
      onNavigate(breadcrumb.path, breadcrumb.id);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-gray-500">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.id} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-300" aria-hidden="true">
              /
            </span>
          )}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {breadcrumb.label}
            </span>
          ) : (
            <button
              onClick={() => handleBreadcrumbClick(breadcrumb)}
              className="hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
            >
              {breadcrumb.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}