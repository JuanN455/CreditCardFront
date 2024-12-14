import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  type?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  type = 'text'
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};