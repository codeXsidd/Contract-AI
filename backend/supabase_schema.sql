-- ============================================================
-- CONTRACT AI - SUPABASE DATABASE SCHEMA
-- ============================================================

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL,
    type TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    effective_date DATE,
    expiry_date DATE,
    value NUMERIC,
    currency TEXT DEFAULT 'USD' NOT NULL,
    file_url TEXT NOT NULL,
    masked_file_url TEXT,
    risk_score INTEGER,
    health_score INTEGER,
    compliance_score INTEGER,
    summary TEXT,
    is_pii_masked BOOLEAN DEFAULT FALSE NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contract_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    version_num INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clauses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    risk_reason TEXT,
    severity INTEGER,
    page_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.risk_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_category TEXT NOT NULL,
    summary TEXT,
    recommendations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.compliance_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    framework TEXT NOT NULL,
    score INTEGER NOT NULL,
    violations JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommendations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.obligations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    due_date DATE,
    responsible_party TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    priority TEXT DEFAULT 'medium' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.negotiations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    negotiation_score INTEGER NOT NULL,
    risk_reduction_pct INTEGER NOT NULL,
    recommendations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    sender TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'upcoming' NOT NULL,
    notified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- SECURITY POLICIES & RLS
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow individual update profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Contracts Policies
CREATE POLICY "Allow individual read contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update contracts" ON public.contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete contracts" ON public.contracts FOR DELETE USING (auth.uid() = user_id);

-- Other tables cascade checks based on contracts ownership
CREATE POLICY "Allow read versions" ON public.contract_versions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert versions" ON public.contract_versions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read clauses" ON public.clauses FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert clauses" ON public.clauses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read risk_reports" ON public.risk_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert risk_reports" ON public.risk_reports FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read compliance_reports" ON public.compliance_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert compliance_reports" ON public.compliance_reports FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read obligations" ON public.obligations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert obligations" ON public.obligations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow update obligations" ON public.obligations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read negotiations" ON public.negotiations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert negotiations" ON public.negotiations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);

CREATE POLICY "Allow read chat_history" ON public.chat_history FOR SELECT USING (
    auth.uid() = user_id
);
CREATE POLICY "Allow insert chat_history" ON public.chat_history FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Allow read deadlines" ON public.deadlines FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
CREATE POLICY "Allow insert deadlines" ON public.deadlines FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND user_id = auth.uid())
);
