-- Mission 1: AI Home Office Assistant — Secure Application Foundation
-- Created: 2026-09-01T00:00:00Z
-- Supabase Project: ai-home-office-v1-eu (numyqalfphyrnedlfzfs)
-- This migration implements the complete data model, RLS policies, storage, triggers, and indexes.

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'de' CHECK (preferred_language IN ('bg', 'de')),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- 2. HOUSEHOLDS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'DE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX households_owner_id ON public.households(owner_id);

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

CREATE POLICY "households_select_own" ON public.households
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "households_insert_own" ON public.households
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "households_update_own" ON public.households
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "households_delete_own" ON public.households
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ============================================================================
-- 3. PROVIDERS TABLE (shared read-only reference catalog)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'electricity', 'gas', 'internet', 'mobile', 'insurance', 'housing',
    'subscription', 'public_authority', 'debt_collection', 'other'
  )),
  website TEXT,
  customer_service_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "providers_select_authenticated" ON public.providers
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- 4. CONTRACTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN (
    'electricity', 'gas', 'internet', 'mobile', 'insurance', 'housing',
    'subscription', 'other'
  )),
  title TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  customer_number TEXT,
  contract_number TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'active', 'cancellation_planned', 'cancelled', 'expired', 'unknown'
  )),
  start_date DATE,
  minimum_term_end DATE,
  cancellation_notice_value INTEGER CHECK (cancellation_notice_value IS NULL OR cancellation_notice_value >= 0),
  cancellation_notice_unit TEXT CHECK (cancellation_notice_unit IS NULL OR cancellation_notice_unit IN ('days', 'weeks', 'months')),
  cancellation_deadline DATE,
  renewal_date DATE,
  monthly_amount NUMERIC(12, 2) CHECK (monthly_amount IS NULL OR monthly_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_interval TEXT CHECK (payment_interval IS NULL OR payment_interval IN (
    'monthly', 'quarterly', 'semiannual', 'annual', 'one_time', 'other'
  )),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX contracts_household_id ON public.contracts(household_id);
CREATE INDEX contracts_status ON public.contracts(status);
CREATE INDEX contracts_cancellation_deadline ON public.contracts(cancellation_deadline);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contracts_select_own_household" ON public.contracts
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "contracts_insert_own_household" ON public.contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "contracts_update_own_household" ON public.contracts
  FOR UPDATE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "contracts_delete_own_household" ON public.contracts
  FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. CASES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN (
    'moving', 'cancellation', 'provider_change', 'billing_question', 'complaint',
    'debt_collection', 'authority_correspondence', 'insurance', 'general'
  )),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'collecting_information', 'ready_for_review', 'awaiting_user_approval',
    'approved', 'sent', 'awaiting_reply', 'completed', 'cancelled'
  )),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN (
    'low', 'normal', 'high', 'urgent'
  )),
  due_date DATE,
  user_intent TEXT,
  missing_information JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX cases_household_id ON public.cases(household_id);
CREATE INDEX cases_status ON public.cases(status);
CREATE INDEX cases_due_date ON public.cases(due_date);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cases_select_own_household" ON public.cases
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "cases_insert_own_household" ON public.cases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "cases_update_own_household" ON public.cases
  FOR UPDATE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "cases_delete_own_household" ON public.cases
  FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  document_type TEXT NOT NULL DEFAULT 'other' CHECK (document_type IN (
    'contract', 'invoice', 'reminder', 'cancellation', 'provider_letter',
    'authority_letter', 'debt_collection_letter', 'payment_proof',
    'identity_document', 'other'
  )),
  processing_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (processing_status IN (
    'uploaded', 'awaiting_analysis', 'analysis_not_configured', 'processed',
    'needs_review', 'failed'
  )),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX documents_household_id ON public.documents(household_id);
CREATE INDEX documents_contract_id ON public.documents(contract_id);
CREATE INDEX documents_case_id ON public.documents(case_id);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_own_household" ON public.documents
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "documents_insert_own_household" ON public.documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "documents_update_own_household" ON public.documents
  FOR UPDATE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "documents_delete_own_household" ON public.documents
  FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. TASKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'in_progress', 'waiting', 'completed', 'cancelled'
  )),
  due_at TIMESTAMP WITH TIME ZONE,
  reminder_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX tasks_household_id ON public.tasks(household_id);
CREATE INDEX tasks_case_id ON public.tasks(case_id);
CREATE INDEX tasks_status ON public.tasks(status);
CREATE INDEX tasks_due_at ON public.tasks(due_at);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_own_household" ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "tasks_insert_own_household" ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "tasks_update_own_household" ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "tasks_delete_own_household" ON public.tasks
  FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. CORRESPONDENCE_DRAFTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.correspondence_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('bg', 'de')),
  recipient_name TEXT,
  recipient_email TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'needs_review', 'awaiting_approval', 'approved', 'rejected', 'sent'
  )),
  generated_by TEXT NOT NULL DEFAULT 'user' CHECK (generated_by IN (
    'user', 'template', 'ai_not_configured', 'ai'
  )),
  evidence_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX correspondence_drafts_household_id ON public.correspondence_drafts(household_id);
CREATE INDEX correspondence_drafts_case_id ON public.correspondence_drafts(case_id);
CREATE INDEX correspondence_drafts_status ON public.correspondence_drafts(status);

ALTER TABLE public.correspondence_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "correspondence_drafts_select_own_household" ON public.correspondence_drafts
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "correspondence_drafts_insert_own_household" ON public.correspondence_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "correspondence_drafts_update_own_household" ON public.correspondence_drafts
  FOR UPDATE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "correspondence_drafts_delete_own_household" ON public.correspondence_drafts
  FOR DELETE
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. APPROVALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES public.correspondence_drafts(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'expired'
  )),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX approvals_household_id ON public.approvals(household_id);
CREATE INDEX approvals_case_id ON public.approvals(case_id);
CREATE INDEX approvals_status ON public.approvals(status);

ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approvals_select_own_household" ON public.approvals
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "approvals_insert_own_household" ON public.approvals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. AUDIT_EVENTS TABLE (append-only)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  event_type TEXT NOT NULL,
  event_summary TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_household_id ON public.audit_events(household_id);
CREATE INDEX audit_events_created_at ON public.audit_events(created_at);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_events_select_own_household" ON public.audit_events
  FOR SELECT
  TO authenticated
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "audit_events_insert_own_household" ON public.audit_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT id FROM public.households WHERE owner_id = auth.uid()
    )
    AND actor_user_id = auth.uid()
  );

-- ============================================================================
-- 11. UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at_trigger BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER households_updated_at_trigger BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER providers_updated_at_trigger BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER contracts_updated_at_trigger BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cases_updated_at_trigger BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER documents_updated_at_trigger BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tasks_updated_at_trigger BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER correspondence_drafts_updated_at_trigger BEFORE UPDATE ON public.correspondence_drafts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 12. PRIVATE STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES (
  'documents',
  'documents',
  false,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[],
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for private documents bucket
CREATE POLICY "documents_storage_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_storage_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_storage_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_storage_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
