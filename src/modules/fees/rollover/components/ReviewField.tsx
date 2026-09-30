interface ReviewFieldProps {
  id?: string
  label: string
  value: string
  required?: boolean
  multiline?: boolean
  type?: "text" | "date"
  placeholder?: string
  readOnly?: boolean
  onChange: (value: string) => void
}

export function ReviewField({
  id,
  label,
  value,
  required = true,
  multiline = false,
  type = "text",
  placeholder,
  readOnly = false,
  onChange,
}: ReviewFieldProps) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase()

  return (
    <label className="rollover-field" htmlFor={fieldId}>
      <span className="rollover-field-label">
        {label}
        {required ? <span className="rollover-field-required">*</span> : null}
      </span>
      {multiline ? (
        <textarea
          id={fieldId}
          className="rollover-field-input"
          rows={3}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          className="rollover-field-input"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}
