import { EDUCATION_OPTIONS } from "@/modules/fees/rollover/constants"
import { ReviewField } from "@/modules/fees/rollover/components/ReviewField"
import { ReviewSelect } from "@/modules/fees/rollover/components/ReviewSelect"
import type { AdultProfile } from "@/modules/fees/rollover/types"

const RELATIONSHIP_OPTIONS = ["Grandfather", "Grandmother", "Uncle", "Aunt", "Other"] as const

interface AdultProfileFormProps {
  idPrefix: string
  profile: AdultProfile
  showRelationship?: boolean
  readOnly?: boolean
  onChange: (patch: Partial<AdultProfile>) => void
}

export function AdultProfileForm({
  idPrefix,
  profile,
  showRelationship = false,
  readOnly = false,
  onChange,
}: AdultProfileFormProps) {
  return (
    <div className="rollover-form-grid">
      <ReviewField
        id={`${idPrefix}-name`}
        label="Name"
        value={profile.name}
        onChange={(name) => onChange({ name })}
        readOnly={readOnly}
      />
      {showRelationship ? (
        <ReviewSelect
          id={`${idPrefix}-relationship`}
          label="Relationship with Student"
          value={profile.relationship || "Grandfather"}
          options={RELATIONSHIP_OPTIONS}
          onChange={(relationship) => onChange({ relationship })}
          readOnly={readOnly}
        />
      ) : null}
      <ReviewField
        id={`${idPrefix}-mobile`}
        label="Mobile No"
        value={profile.mobile}
        onChange={(mobile) => onChange({ mobile })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-email`}
        label="Email"
        value={profile.email}
        onChange={(email) => onChange({ email })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-aadhaar`}
        label="Aadhar Card No"
        value={profile.aadhaar}
        onChange={(aadhaar) => onChange({ aadhaar })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-pan`}
        label="PAN Card No"
        value={profile.pan}
        onChange={(pan) => onChange({ pan })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-country`}
        label="Country"
        value={profile.country}
        onChange={(country) => onChange({ country })}
        readOnly={readOnly}
      />
      <ReviewSelect
        id={`${idPrefix}-education`}
        label="Educational Qualifications"
        value={profile.education}
        options={EDUCATION_OPTIONS}
        onChange={(education) => onChange({ education })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-profession`}
        label="Profession"
        value={profile.profession}
        onChange={(profession) => onChange({ profession })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-organisation`}
        label="Organisation"
        value={profile.organisation}
        onChange={(organisation) => onChange({ organisation })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-designation`}
        label="Designation"
        value={profile.designation}
        onChange={(designation) => onChange({ designation })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-office-no`}
        label="Office No"
        value={profile.officeNo}
        onChange={(officeNo) => onChange({ officeNo })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-office-address`}
        label="Office Address"
        value={profile.officeAddress}
        multiline
        onChange={(officeAddress) => onChange({ officeAddress })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-linkedin`}
        label="Website / LinkedIn Profile"
        value={profile.linkedin}
        required={false}
        onChange={(linkedin) => onChange({ linkedin })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-income`}
        label="Annual Income (In Lacs)"
        value={profile.annualIncome}
        onChange={(annualIncome) => onChange({ annualIncome })}
        readOnly={readOnly}
      />
      <fieldset className="rollover-field">
        <legend className="rollover-field-label">
          Are you a Government Employee (Y/N)
          <span className="rollover-field-required">*</span>
        </legend>
        <div className="rollover-yes-no">
          <button
            type="button"
            className="rollover-yes-no-btn"
            data-selected={!profile.governmentEmployee}
            disabled={readOnly}
            onClick={() => onChange({ governmentEmployee: false })}
          >
            No
          </button>
          <button
            type="button"
            className="rollover-yes-no-btn"
            data-selected={profile.governmentEmployee}
            disabled={readOnly}
            onClick={() => onChange({ governmentEmployee: true })}
          >
            Yes
          </button>
        </div>
      </fieldset>
    </div>
  )
}
