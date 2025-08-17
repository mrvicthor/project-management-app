import type { ChangeEvent } from "react";

type InputProps = {
  validateNameField: () => void;
  handleFocus: () => void;
  label: string;
  handleValueChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  name: string;
  errorText: string;
  value: string;
};

const InputField = ({
  validateNameField,
  handleFocus,
  label,
  handleValueChange,
  name,
  value,
  errorText,
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        onFocus={validateNameField}
        onBlur={handleFocus}
        onChange={handleValueChange}
        value={value}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="Enter client name"
      />
      {errorText && (
        <span aria-live="polite" className="text-red-500 text-sm">
          {errorText}
        </span>
      )}
    </div>
  );
};

export default InputField;
