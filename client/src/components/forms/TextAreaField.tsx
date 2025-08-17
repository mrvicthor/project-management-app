import type { ChangeEvent } from "react";

type TextAreaProps = {
  label: string;
  name: string;
  validateTextAreaField: () => void;
  handleDescriptionFocus: () => void;
  value: string;
  handleValueChange: (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => void;
  errorText: string;
};

const TextAreaField = ({
  label,
  name,
  validateTextAreaField,
  handleDescriptionFocus,
  value,
  handleValueChange,
  errorText,
}: TextAreaProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <textarea
        id="description"
        rows={4}
        onFocus={validateTextAreaField}
        onBlur={handleDescriptionFocus}
        value={value}
        onChange={handleValueChange}
        name={name}
        placeholder="Enter a description..."
        className="w-full max-w-lg p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
      ></textarea>
      {errorText && (
        <span aria-live="polite" className="text-red-500 text-sm">
          {errorText}
        </span>
      )}
    </div>
  );
};

export default TextAreaField;
