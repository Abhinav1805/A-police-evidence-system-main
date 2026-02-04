export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
          error
            ? 'ring-red-500 focus:ring-red-500'
            : 'ring-gray-300 focus:ring-blue-500 dark:ring-gray-700'
        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-800`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}