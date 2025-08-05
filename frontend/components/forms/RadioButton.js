'use client';

const RadioButton = ({ name, value, label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer mb-2">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400'
        }`}>
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          )}
        </div>
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
};
export default RadioButton;