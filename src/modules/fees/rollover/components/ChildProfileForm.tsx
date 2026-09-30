import { Camera } from "lucide-react"
import type { ChangeEvent } from "react"
import {
  BLOOD_GROUP_OPTIONS,
  EMERGENCY_RELATIONSHIP_OPTIONS,
  GENDER_OPTIONS,
} from "@/modules/fees/rollover/constants"
import { ReviewField } from "@/modules/fees/rollover/components/ReviewField"
import { ReviewSelect } from "@/modules/fees/rollover/components/ReviewSelect"
import type { ChildRolloverProfile } from "@/modules/fees/rollover/types"

interface ChildProfileFormProps {
  idPrefix: string
  profile: ChildRolloverProfile
  readOnly?: boolean
  onChange: (patch: Partial<ChildRolloverProfile>) => void
}

export function ChildProfileForm({
  idPrefix,
  profile,
  readOnly = false,
  onChange,
}: ChildProfileFormProps) {
  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({ photoUrl: reader.result })
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  return (
    <div className="rollover-form-grid rollover-child-form-grid">
      <div className="rollover-child-photo">
        {profile.photoUrl ? (
          <img src={profile.photoUrl} alt={`${profile.name} photo`} className="rollover-child-photo-img" />
        ) : (
          <div className="rollover-child-photo-placeholder" aria-hidden />
        )}
        {readOnly ? null : (
          <label className="rollover-child-photo-upload">
            <Camera size={16} aria-hidden />
            <span>Upload or click a photo</span>
            <input
              type="file"
              accept="image/*"
              className="rollover-file-input"
              onChange={handlePhotoChange}
            />
          </label>
        )}
      </div>

      <ReviewField
        id={`${idPrefix}-year`}
        label="Academic year"
        value={profile.academicYear}
        onChange={(academicYear) => onChange({ academicYear })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-name`}
        label="Name"
        value={profile.name}
        onChange={(name) => onChange({ name })}
        readOnly={readOnly}
      />
      <ReviewSelect
        id={`${idPrefix}-gender`}
        label="Gender"
        value={profile.gender}
        options={GENDER_OPTIONS}
        placeholder="Select"
        onChange={(gender) => onChange({ gender })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-class`}
        label="Class"
        value={profile.classLabel}
        onChange={(classLabel) => onChange({ classLabel })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-nationality`}
        label="Nationality"
        value={profile.nationality}
        onChange={(nationality) => onChange({ nationality })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-country`}
        label="Country"
        value={profile.country}
        onChange={(country) => onChange({ country })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-aadhaar`}
        label="Student Aadhar Card No"
        value={profile.aadhaar}
        onChange={(aadhaar) => onChange({ aadhaar })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-address`}
        label="Residential Address"
        value={profile.residentialAddress}
        multiline
        onChange={(residentialAddress) => onChange({ residentialAddress })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-dob`}
        label="Date of Birth"
        type="date"
        value={profile.dateOfBirth}
        onChange={(dateOfBirth) => onChange({ dateOfBirth })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-pob`}
        label="Place of Birth"
        value={profile.placeOfBirth}
        onChange={(placeOfBirth) => onChange({ placeOfBirth })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-religion`}
        label="Religion"
        value={profile.religion}
        onChange={(religion) => onChange({ religion })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-tongue`}
        label="Mother Tongue"
        value={profile.motherTongue}
        onChange={(motherTongue) => onChange({ motherTongue })}
        readOnly={readOnly}
      />
      <ReviewSelect
        id={`${idPrefix}-blood`}
        label="Blood Group"
        value={profile.bloodGroup}
        options={BLOOD_GROUP_OPTIONS}
        placeholder="Select"
        onChange={(bloodGroup) => onChange({ bloodGroup })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-passport`}
        label="Passport No"
        value={profile.passportNo}
        required={false}
        onChange={(passportNo) => onChange({ passportNo })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-passport-expiry`}
        label="Passport Expire"
        type="date"
        value={profile.passportExpiry}
        required={false}
        onChange={(passportExpiry) => onChange({ passportExpiry })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-oci`}
        label="OCI / Visa"
        value={profile.ociVisa}
        required={false}
        onChange={(ociVisa) => onChange({ ociVisa })}
        readOnly={readOnly}
      />
      <ReviewField
        id={`${idPrefix}-emergency`}
        label="Emergency Contact Person"
        value={profile.emergencyContactName}
        onChange={(emergencyContactName) => onChange({ emergencyContactName })}
        readOnly={readOnly}
      />
      <ReviewSelect
        id={`${idPrefix}-emergency-rel`}
        label="Relationship Contact Person"
        value={profile.emergencyContactRelationship}
        options={EMERGENCY_RELATIONSHIP_OPTIONS}
        placeholder="Select"
        onChange={(emergencyContactRelationship) => onChange({ emergencyContactRelationship })}
        readOnly={readOnly}
      />
    </div>
  )
}
