export type TaxQuestionCategory =
  | "personal_data"
  | "employment"
  | "commuting"
  | "home_office"
  | "advertising_expenses"
  | "children"
  | "vorsorgeaufwand"
  | "sonderausgaben"
  | "extraordinary_burdens"
  | "household_services"
  | "support_payments"
  | "double_household"

export type QuestionnaireFieldType = "text" | "number" | "date" | "boolean" | "select"
export type RequiredStatus = "REQUIRED" | "CONDITIONAL" | "OPTIONAL"
export type VerificationStatus = "VERIFIED" | "UNVERIFIED"

export type TaxQuestion = {
  question_id: string
  tax_year: 2025
  category: TaxQuestionCategory
  official_german_label: string
  bulgarian_question: string
  bulgarian_help: string
  why_required: string
  field_type: QuestionnaireFieldType
  required_status: RequiredStatus
  conditional_rule: string | null
  validation_rule: string | null
  source_form: string
  source_section: string | null
  source_page: number | null
  verification_status: VerificationStatus
}

const unanswered: Omit<TaxQuestion, "question_id" | "category" | "official_german_label" | "bulgarian_question" | "source_form"> = {
  tax_year: 2025,
  bulgarian_help: "Този въпрос е подготвен за проверка, но официалният източник още не е прикачен към проекта.",
  why_required: "Необходимостта ще бъде потвърдена след проверка на официалния формуляр за 2025 г.",
  field_type: "text",
  required_status: "OPTIONAL",
  conditional_rule: null,
  validation_rule: null,
  source_section: null,
  source_page: null,
  verification_status: "UNVERIFIED",
}

export const taxQuestionnaire2025: TaxQuestion[] = [
  { ...unanswered, question_id: "personal-data-name", category: "personal_data", official_german_label: "Persönliche Angaben", bulgarian_question: "Какви лични данни са необходими за декларацията?", source_form: "EST-1A" },
  { ...unanswered, question_id: "employment-lohnsteuerbescheinigung", category: "employment", official_german_label: "Lohnsteuerbescheinigung", bulgarian_question: "Какви данни от Lohnsteuerbescheinigung трябва да въведа?", source_form: "ANLAGE-N" },
  { ...unanswered, question_id: "commuting-entfernungspauschale", category: "commuting", official_german_label: "Entfernungspauschale", bulgarian_question: "Какви данни са нужни за Entfernungspauschale?", source_form: "ANLAGE-N" },
  { ...unanswered, question_id: "home-office", category: "home_office", official_german_label: "Homeoffice", bulgarian_question: "Има ли данни за работа от дома, които трябва да бъдат проверени?", source_form: "ANLAGE-N" },
  { ...unanswered, question_id: "werbungskosten", category: "advertising_expenses", official_german_label: "Werbungskosten", bulgarian_question: "Какви berufliche Aufwendungen трябва да бъдат проверени?", source_form: "ANLAGE-N" },
  { ...unanswered, question_id: "children", category: "children", official_german_label: "Anlage Kind", bulgarian_question: "Има ли данни за деца, които са нужни за Anlage Kind?", source_form: "ANLAGE-KIND" },
  { ...unanswered, question_id: "vorsorgeaufwand", category: "vorsorgeaufwand", official_german_label: "Vorsorgeaufwand", bulgarian_question: "Какви данни за Vorsorgeaufwand трябва да бъдат проверени?", source_form: "ANLAGE-V" },
  { ...unanswered, question_id: "sonderausgaben", category: "sonderausgaben", official_german_label: "Sonderausgaben", bulgarian_question: "Какви данни за Sonderausgaben трябва да бъдат проверени?", source_form: "ANLAGE-SO" },
  { ...unanswered, question_id: "extraordinary-burdens", category: "extraordinary_burdens", official_german_label: "Außergewöhnliche Belastungen", bulgarian_question: "Има ли данни за Außergewöhnliche Belastungen?", source_form: "ANLAGE-AGB" },
  { ...unanswered, question_id: "household-services", category: "household_services", official_german_label: "Haushaltsnahe Aufwendungen", bulgarian_question: "Има ли данни за Haushaltsnahe Aufwendungen?", source_form: "ANLAGE-HHA" },
  { ...unanswered, question_id: "support-payments", category: "support_payments", official_german_label: "Unterhalt", bulgarian_question: "Има ли данни за Unterhalt, които трябва да бъдат проверени?", source_form: "ANLAGE-UNT" },
  { ...unanswered, question_id: "double-household", category: "double_household", official_german_label: "Doppelte Haushaltsführung", bulgarian_question: "Има ли данни за Doppelte Haushaltsführung?", source_form: "ANLAGE-N-DHF" },
]

export const verifiedTaxQuestions = taxQuestionnaire2025.filter((question) => question.verification_status === "VERIFIED")
export const verifiedConditionalRules = verifiedTaxQuestions.filter((question) => question.conditional_rule)

export function isApplicableTaxQuestion(question: TaxQuestion, answers: Record<string, unknown>) {
  if (question.verification_status !== "VERIFIED") return true
  if (!question.conditional_rule) return true
  return Boolean(answers[question.conditional_rule])
}
