'use client';
import { iconMap } from '@/components/ui/icons';

const FormInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-85 flex items-center pointer-events-none text-black">
            {iconMap[icon]}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3 rounded-lg border bg-white text-gray-900 ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 placeholder-gray-400`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;