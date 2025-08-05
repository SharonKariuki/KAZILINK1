'use client';

const Checkbox = ({ name, checked, onChange, label, error }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="group mb-3">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
          checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-400'
        }`}>
          {checked && (
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={`text-sm transition-colors duration-200 ${
          error ? 'text-red-600' : 'text-gray-700 group-hover:text-gray-800'
        }`}>{label}</span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1 ml-8">{error}</p>}
    </div>
  );
};

export default Checkbox; 