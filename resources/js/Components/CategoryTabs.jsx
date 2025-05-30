export function CategoryTabs({ categories, active, onSelect }) {
  return (
    <div className="flex space-x-2 overflow-x-auto mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full ${
            active === cat ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
