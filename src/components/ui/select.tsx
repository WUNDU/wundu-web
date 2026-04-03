import { SelectProps } from "@/types/ui";

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  className,
}) => {
  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label className="text-gray-600">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
