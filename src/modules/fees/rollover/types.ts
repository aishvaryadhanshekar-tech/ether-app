export type AdultRole = "father" | "mother" | "guardian"

export interface AdultProfile {
  name: string
  relationship: string
  mobile: string
  email: string
  aadhaar: string
  pan: string
  country: string
  education: string
  profession: string
  organisation: string
  designation: string
  officeNo: string
  officeAddress: string
  linkedin: string
  annualIncome: string
  governmentEmployee: boolean
}

export interface ChildRolloverProfile {
  name: string
  classLabel: string
  section: string
  rollNumber: string
  dateOfBirth: string
  photoUrl: string
  academicYear: string
  gender: string
  nationality: string
  country: string
  aadhaar: string
  residentialAddress: string
  placeOfBirth: string
  religion: string
  motherTongue: string
  bloodGroup: string
  passportNo: string
  passportExpiry: string
  ociVisa: string
  emergencyContactName: string
  emergencyContactRelationship: string
  allergies: string
  medicalNotes: string
  primaryMobile: string
}

export interface RolloverFamily {
  father: AdultProfile
  mother: AdultProfile
  guardian: AdultProfile
}

export interface RolloverProgressSnapshot {
  family: RolloverFamily
  childProfile: ChildRolloverProfile | undefined
  agreedDocIds: string[]
  esignName: string
}

export interface DeclarationDoc {
  id: string
  title: string
  body: string
}
