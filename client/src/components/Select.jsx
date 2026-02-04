import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label, 
  name,
  options, 
  value, 
  onChange, 
  error, 
  required = false,
  className = '',
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        ref={ref}
        value={value || ''}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
          error
            ? 'ring-red-500 focus:ring-red-500'
            : 'ring-gray-300 focus:ring-blue-500 dark:ring-gray-700'
        } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-800`}
      >
        <option value="">Select...</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;