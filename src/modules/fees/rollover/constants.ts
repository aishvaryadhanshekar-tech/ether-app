import type { AdultProfile, ChildRolloverProfile, DeclarationDoc, RolloverFamily } from "@/modules/fees/rollover/types"

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const

export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

export const EMERGENCY_RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Guardian",
  "Grandfather",
  "Grandmother",
  "Uncle",
  "Aunt",
  "Other",
] as const

export const EDUCATION_OPTIONS = [
  "High School",
  "Bachelor's",
  "Master's",
  "Doctorate",
  "Other",
] as const

const DECLARATION_INTRO = `This document is provided for review as part of the school's rollover process for the academic year 2026–2027. Parents and guardians are asked to read every clause carefully before agreeing.`

const DECLARATION_OUTRO = `By agreeing, you confirm that you have read and understood this form in full, and that the information you have reviewed for this child is true and correct to the best of your knowledge. Completing rollover for one child does not complete rollover for any sibling.`

function declarationBody(clauses: string[]) {
  return [
    DECLARATION_INTRO,
    ...clauses.map((clause, index) => `${index + 1}. ${clause}`),
    DECLARATION_OUTRO,
  ].join("\n\n")
}

const FORM_C_BODY = declarationBody([
  "I/We declare that the particulars furnished in the rollover form, including the student's name, date of birth, address and parent details, are true and complete. The school may verify them against Aadhaar, the birth certificate and previous school records.",
  "I/We understand that admission to the next grade is subject to the student meeting the promotion criteria laid down by the school and the affiliating board for the academic year 2025–2026.",
  "I/We agree to inform the school office in writing within 7 days of any change in residential address, mobile number, email address or emergency contact. Communication sent to the details on record will be treated as delivered.",
  "I/We confirm that the medical information shared, including allergies, chronic conditions and regular medication, is accurate. The school will not be held responsible for consequences arising from information that was withheld or not updated.",
  "In a medical emergency, I/we authorise the school to arrange first aid and, where needed, to take the student to the nearest hospital, if a parent or guardian cannot be reached at that time.",
  "I/We consent to the school using photographs and videos of the student taken during school events in the school magazine, website, notice boards and official social media handles. This consent can be withdrawn by writing to the school office.",
  "I/We understand that the school may share the student's academic and attendance records with the affiliating board, government authorities and, when requested, the next school the student joins.",
  "I/We acknowledge that any false or misleading information in this form may lead to cancellation of admission at any stage, without refund of fees already paid.",
])

const FORM_C1_DECLARATION_BODY = declarationBody([
  "I/We undertake to ensure that the student attends school regularly and punctually. A minimum of 75% attendance is required to be eligible for the annual examinations, as per board norms.",
  "Leave for more than 2 consecutive days must be applied for in advance through the parent app or in writing to the class teacher. Absence due to illness for 3 or more days must be supported by a medical certificate on return.",
  "I/We understand that students who are absent without intimation for 15 consecutive working days may have their name struck off the rolls. Re-admission in that case is at the discretion of the Principal and may attract a re-admission fee.",
  "I/We will ensure that the student comes to school in the prescribed uniform, with an identity card, and carrying only the books and materials required for the day's timetable.",
  "Mobile phones, smart watches with calling features and other electronic devices are not permitted on campus. Devices found with students will be kept by the school and returned only to a parent or guardian.",
  "I/We agree that the student will travel only by the mode of transport declared in the rollover form. Any change, including private pick-up by a person not listed, must be informed to the school office in writing beforehand.",
  "I/We will attend Parent–Teacher Meetings and other meetings called by the school, and will review circulars, homework and announcements shared through the parent app.",
  "I/We accept that the school's decisions on promotion, section allocation and choice of subjects, taken in line with board guidelines, are final.",
])

const FORM_D_BODY = declarationBody([
  "Parents and guardians are expected to treat teachers, staff, students and other parents with courtesy and respect, in person, on phone calls and in all written and online communication.",
  "Concerns about a student's academics, behaviour or wellbeing should first be raised with the class teacher, then with the section coordinator, and only then with the Principal. Parents should not approach other students or their families directly to resolve issues.",
  "Parent WhatsApp groups and social media must not be used to share unverified information about the school, its staff or its students. Official information is shared only through the parent app, circulars and the school website.",
  "Parents may enter the campus only during designated visiting hours or with a prior appointment, and must carry the parent ID card issued by the school. Classrooms may not be visited while classes are in session.",
  "Parents must not offer gifts, cash or other favours to teachers or staff. Students may give handmade cards or tokens of appreciation on occasions such as Teachers' Day.",
  "Private tuition by school teachers for students of their own class is not permitted. Parents are requested not to approach school staff for this purpose.",
  "Smoking, alcohol and tobacco products are strictly prohibited on the school campus and within 100 metres of the school gates, including at pick-up and drop-off points.",
  "Parents are responsible for their conduct and that of their accompanying family members at school events, sports days and annual functions, including following instructions from school volunteers and security staff.",
  "Repeated violation of this code of conduct may lead to restrictions on campus access and, in serious cases, review of the student's continued enrolment by the school management.",
])

const FORM_C1_FEES_BODY = declarationBody([
  "Fees are payable per term, in advance, on or before the due date shown in the parent app. Payments can be made through UPI, debit or credit card, or net banking. Cash is accepted only at the accounts office during working hours.",
  "A late fee of ₹50 per day will be charged for payments received after the due date, up to a maximum of ₹1,500 per term. Fees outstanding for more than 60 days may result in the student's name being withheld from examination rolls.",
  "Where the school offers an installment plan, the second installment must be paid within 60 days of the first. Missing an installment will make the full remaining balance due immediately.",
  "Cheques returned unpaid for any reason will attract a charge of ₹500 in addition to the applicable late fee. After two returned cheques, only online payments will be accepted from that family.",
  "Fees once paid are not refundable, except for the refundable caution deposit, which is returned within 60 days of the student leaving the school, after adjusting any outstanding dues.",
  "Transport fees are charged for the full term and are not reduced for short absences, school holidays or partial use of the bus service during the term.",
  "The school reserves the right to revise fees at the start of each academic year, in line with the guidelines of the Fee Regulatory Committee. Revised fees will be communicated in writing before they take effect.",
  "A sibling concession, where applicable, is given on the tuition fee of the younger child only, and only while both children remain enrolled in the school.",
  "Receipts for every payment are available in the parent app. Parents are advised to download and keep them for income tax claims under Section 80C.",
])

const FORM_E2_BODY = declarationBody([
  "Tuition Fee is charged per term and covers classroom teaching, the curriculum, internal assessments and the use of classroom resources for the student's grade.",
  "The Development Fund is used towards the upkeep and improvement of school infrastructure, including classrooms, laboratories, sports facilities and campus safety.",
  "Exams & Evaluation Charges cover board-prescribed periodic tests, term-end examinations, answer sheets, the printing of question papers and the issuing of report cards.",
  "The Computer & Science Lab Fee covers practical sessions, consumables, software licences and the maintenance of lab equipment used by the student's grade.",
  "Library & Digital Resources covers access to the school library, e-books and the online learning platforms the school subscribes to during the academic year.",
  "Activity charges cover art and craft materials, co-curricular clubs, the annual sports meet, and in-school workshops conducted by visiting experts.",
  "The School Bus Transport fee is based on the pick-up zone declared in the rollover form. A change of zone during the term will be charged from the following term.",
  "Books & Stationery charges cover prescribed textbooks, notebooks and the stationery kit issued at the start of the academic year. Lost items will be replaced at cost.",
  "All fees shown are inclusive of applicable taxes. The term-wise breakdown for each child is available on the Fees & Payments screen in the parent app.",
])

export const DECLARATION_DOCS: DeclarationDoc[] = [
  {
    id: "form-c",
    title: "Form C — Declaration By Parent/Guardians",
    body: FORM_C_BODY,
  },
  {
    id: "form-c1-declaration",
    title: "Form C1 — Declaration By Parent/Guardians",
    body: FORM_C1_DECLARATION_BODY,
  },
  {
    id: "form-d",
    title: "Form D — Code of conduct for Parent/Guardians",
    body: FORM_D_BODY,
  },
  {
    id: "form-c1-fees",
    title: "Form C1 — Fee Terms & Conditions",
    body: FORM_C1_FEES_BODY,
  },
  {
    id: "form-e2",
    title: "Form E2 — Fee Structure",
    body: FORM_E2_BODY,
  },
]

function adult(overrides: Partial<AdultProfile> = {}): AdultProfile {
  return {
    name: "Rajesh Mehta",
    relationship: "",
    mobile: "9898989898",
    email: "rajesh.mehta@email.com",
    aadhaar: "1234 4444 4444",
    pan: "ABCDEF1233K",
    country: "India",
    education: "High School",
    profession: "Software",
    organisation: "Technogies",
    designation: "Tech",
    officeNo: "28973921879",
    officeAddress: "G-404 Tower, Malad West, Mumbai, 400064",
    linkedin: "www.linkedin.com/in/rajeshmehta",
    annualIncome: "26L",
    governmentEmployee: false,
    ...overrides,
  }
}

export function createDefaultRolloverFamily(): RolloverFamily {
  return {
    father: adult({ name: "Rajesh Mehta", email: "rajesh.mehta@email.com" }),
    mother: adult({
      name: "Priya Mehta",
      email: "priya.mehta@email.com",
      profession: "Educator",
      designation: "Teacher",
      organisation: "City Public School",
    }),
    guardian: adult({
      name: "",
      relationship: "Grandfather",
      email: "",
      mobile: "",
    }),
  }
}

function childProfile(
  overrides: Partial<ChildRolloverProfile>,
): ChildRolloverProfile {
  return {
    name: "",
    classLabel: "",
    section: "",
    rollNumber: "",
    dateOfBirth: "",
    photoUrl: "",
    academicYear: "2026–2027",
    gender: "",
    nationality: "Indian",
    country: "India",
    aadhaar: "",
    residentialAddress: "G-404 Tower\nMalad West\nMumbai\n400064",
    placeOfBirth: "Mumbai",
    religion: "",
    motherTongue: "Gujarati",
    bloodGroup: "",
    passportNo: "",
    passportExpiry: "",
    ociVisa: "",
    emergencyContactName: "Rajesh Mehta",
    emergencyContactRelationship: "Father",
    allergies: "",
    medicalNotes: "",
    primaryMobile: "9898989898",
    ...overrides,
  }
}

export function createDefaultChildProfiles(): Record<string, ChildRolloverProfile> {
  return {
    child_1: childProfile({
      name: "Aarav Mehta",
      classLabel: "Grade 6",
      section: "A",
      rollNumber: "18",
      dateOfBirth: "2014-06-12",
      photoUrl: "/images/aarav-mehta.png",
      gender: "Male",
      aadhaar: "1234 5678 8765 4321",
      religion: "Hindu",
      bloodGroup: "B+",
      passportNo: "DVKDVH82791",
      passportExpiry: "2030-03-23",
      allergies: "None",
      medicalNotes: "No ongoing medication.",
    }),
    child_2: childProfile({
      name: "Mira Mehta",
      classLabel: "Grade 3",
      section: "C",
      rollNumber: "07",
      dateOfBirth: "2017-11-03",
      photoUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80",
      gender: "Female",
      aadhaar: "4321 8765 5678 1234",
      religion: "Hindu",
      bloodGroup: "O+",
      passportNo: "MIRA8K2017",
      passportExpiry: "2031-11-03",
      allergies: "Mild dust allergy",
      medicalNotes: "Inhaler as needed during sports.",
    }),
  }
}
