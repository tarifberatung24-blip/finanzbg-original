export type TaxQuestionCategory = "personal_data" | "employment" | "commuting" | "home_office" | "advertising_expenses" | "children" | "vorsorgeaufwand" | "sonderausgaben" | "extraordinary_burdens" | "household_services" | "support_payments" | "double_household"
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
  source_url: string | null
  source_id: string | null
  canonical_field: string | null
  verification_status: VerificationStatus
}

const fmsUrl = (id: string) => `https://www.formulare-bfinv.de/ffw/action/invoke.do?id=${id}`
const officialIndex = "https://finanzamt.thueringen.de/service/formulare/einkommensteuer/2025"

const verified = (question: Omit<TaxQuestion, "tax_year" | "bulgarian_help" | "why_required" | "verification_status">): TaxQuestion => ({
  ...question,
  tax_year: 2025,
  bulgarian_help: "Потвърдено чрез предоставения текстов extract от официалния FMS PDF за 2025 г.",
  why_required: "Полето е изписано в посочения официален формуляр и ред.",
  verification_status: "VERIFIED",
})

const unverified = (question: Omit<TaxQuestion, "tax_year" | "bulgarian_help" | "why_required" | "source_page" | "source_url" | "source_section" | "source_id" | "canonical_field" | "verification_status">): TaxQuestion => ({
  ...question,
  tax_year: 2025,
  bulgarian_help: "Официалният формуляр за 2025 г. трябва да бъде проверен преди използване.",
  why_required: "Ще бъде потвърдено само чрез официален източник за 2025 г.",
  source_section: null,
  source_page: null,
  source_url: null,
  source_id: null,
  canonical_field: null,
  verification_status: "UNVERIFIED",
})

export const taxQuestionnaire2025: TaxQuestion[] = [
  verified({ question_id: "personal-data-name", category: "personal_data", official_german_label: "Name", bulgarian_question: "Какво е името ви?", field_type: "text", required_status: "REQUIRED", conditional_rule: null, validation_rule: "non_empty", source_form: "034037_25", source_section: "Allgemeine Angaben · Zeile 9", source_page: 1, source_url: fmsUrl("034037_25"), source_id: "fms-034037_25", canonical_field: "taxpayer.name" }),
  verified({ question_id: "employment-lohnsteuerbescheinigung", category: "employment", official_german_label: "Bruttoarbeitslohn einschließlich Sachbezüge", bulgarian_question: "Какъв е брутният доход от труд, включително непаричните придобивки?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "employment_income", validation_rule: "non_negative", source_form: "034027_25", source_section: "Angaben zum Arbeitslohn · Zeile 5", source_page: 1, source_url: fmsUrl("034027_25"), source_id: "fms-034027_25", canonical_field: "employmentIncome.grossWages" }),
  verified({ question_id: "commuting-entfernungspauschale", category: "commuting", official_german_label: "Entfernungspauschale", bulgarian_question: "Какво е разстоянието до първото работно място за Entfernungspauschale?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "commuting_expenses", validation_rule: "non_negative", source_form: "034027_25", source_section: "Werbungskosten · Entfernungspauschale · Zeile 30", source_page: 2, source_url: fmsUrl("034027_25"), source_id: "fms-034027_25", canonical_field: "workRelatedExpenses.commuteDistanceKm" }),
  verified({ question_id: "home-office", category: "home_office", official_german_label: "Tagespauschale (bei beruflicher Tätigkeit im Homeoffice)", bulgarian_question: "Колко календарни дни сте работили от дома?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "home_office", validation_rule: "non_negative", source_form: "034027_25", source_section: "Tagespauschale · Zeilen 58–59", source_page: 3, source_url: fmsUrl("034027_25"), source_id: "fms-034027_25", canonical_field: "workRelatedExpenses.homeOfficeDays" }),
  verified({ question_id: "children", category: "children", official_german_label: "Angaben zum Kind", bulgarian_question: "Какви са идентификационният номер, името и датата на раждане на детето?", field_type: "text", required_status: "CONDITIONAL", conditional_rule: "has_children", validation_rule: "non_empty", source_form: "034025_25", source_section: "Angaben zum Kind · Zeilen 4–6", source_page: 1, source_url: fmsUrl("034025_25"), source_id: "fms-034025_25", canonical_field: "children.identity" }),
  unverified({ question_id: "werbungskosten", category: "advertising_expenses", official_german_label: "Werbungskosten", bulgarian_question: "Какви berufliche Aufwendungen трябва да бъдат проверени?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "employment_income", validation_rule: "non_negative", source_form: "034027_25" }),
  unverified({ question_id: "vorsorgeaufwand", category: "vorsorgeaufwand", official_german_label: "Vorsorgeaufwand", bulgarian_question: "Какви данни за Vorsorgeaufwand трябва да бъдат проверени?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "has_insurance", validation_rule: "non_negative", source_form: "034098_25" }),
  unverified({ question_id: "sonderausgaben", category: "sonderausgaben", official_german_label: "Sonderausgaben", bulgarian_question: "Какви данни за Sonderausgaben трябва да бъдат проверени?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "has_special_expenses", validation_rule: "non_negative", source_form: "035006_25" }),
  unverified({ question_id: "extraordinary-burdens", category: "extraordinary_burdens", official_german_label: "Außergewöhnliche Belastungen", bulgarian_question: "Има ли данни за Außergewöhnliche Belastungen?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "has_extraordinary_burdens", validation_rule: "non_negative", source_form: "035007_25" }),
  unverified({ question_id: "household-services", category: "household_services", official_german_label: "Haushaltsnahe Aufwendungen", bulgarian_question: "Има ли данни за Haushaltsnahe Aufwendungen?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "has_household_services", validation_rule: "non_negative", source_form: "035009_25" }),
  unverified({ question_id: "support-payments", category: "support_payments", official_german_label: "Unterhalt", bulgarian_question: "Има ли данни за Unterhalt, които трябва да бъдат проверени?", field_type: "number", required_status: "CONDITIONAL", conditional_rule: "has_support_payments", validation_rule: "non_negative", source_form: "034031_25" }),
  unverified({ question_id: "double-household", category: "double_household", official_german_label: "Doppelte Haushaltsführung", bulgarian_question: "Има ли данни за Doppelte Haushaltsführung?", field_type: "boolean", required_status: "CONDITIONAL", conditional_rule: "double_household", validation_rule: null, source_form: "034027d_25" }),
]

export const verifiedTaxQuestions = taxQuestionnaire2025.filter((question) => question.verification_status === "VERIFIED")
export const verifiedConditionalRules = verifiedTaxQuestions.filter((question) => question.conditional_rule)
export function isApplicableTaxQuestion(question: TaxQuestion, answers: Record<string, unknown>) { return !question.conditional_rule || Boolean(answers[question.conditional_rule]) }
export const taxQuestionnaireAudit = { verifiedCount: verifiedTaxQuestions.length, unverifiedCount: taxQuestionnaire2025.length - verifiedTaxQuestions.length, missingMappings: taxQuestionnaire2025.filter((question) => !question.canonical_field).map((question) => question.question_id) }

export const taxQuestionnaireSourceAudit = { source: officialIndex, verifiedQuestionIds: verifiedTaxQuestions.map((question) => question.question_id), unverifiedQuestionIds: taxQuestionnaire2025.filter((question) => question.verification_status === "UNVERIFIED").map((question) => question.question_id) }
