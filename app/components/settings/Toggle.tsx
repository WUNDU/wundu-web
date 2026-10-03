type ToggleProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

function Toggle({ checked, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-6 w-11 shrink-0 items-center rounded-[99px] p-0.5 transition-colors duration-200 ${
        checked
          ? "justify-end bg-(--bg-button)"
          : "justify-start bg-neutrals-300"
      }`}
    >
      <span aria-hidden="true" className="size-5 rounded-full bg-white" />
    </button>
  );
}

export default Toggle;
