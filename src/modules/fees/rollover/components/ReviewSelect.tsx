interface ReviewSelectProps {
  id?: string
  label: string
  value: string
  required?: boolean
  options: readonly string[]
  placeholder?: string
  readOnly?: boolean
  onChange: (value: string) => void
}

export function ReviewSelect({
  id,
  label,
  value,
  required = true,
  options,
  placeholder,
  readOnly = false,
  onChange,
}: ReviewSelectProps) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase()

  return (
    <label className="rollover-field" htmlFor={fieldId}>
      <span className="rollover-field-label">
        {label}
        {required ? <span className="rollover-field-required">*</span> : null}
      </span>
      <select
        id={fieldId}
        className="rollover-field-input rollover-field-select"
        value={value}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
