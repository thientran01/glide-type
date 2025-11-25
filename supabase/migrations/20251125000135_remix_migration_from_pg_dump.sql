CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: trials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    typed_text text NOT NULL,
    target_text text NOT NULL,
    elapsed_time integer NOT NULL,
    wpm integer NOT NULL,
    accuracy integer NOT NULL,
    total_drag_distance integer NOT NULL,
    character_count integer NOT NULL,
    avg_time_per_char numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: trials trials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trials
    ADD CONSTRAINT trials_pkey PRIMARY KEY (id);


--
-- Name: trials Anyone can delete trials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete trials" ON public.trials FOR DELETE USING (true);


--
-- Name: trials Anyone can insert trials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert trials" ON public.trials FOR INSERT WITH CHECK (true);


--
-- Name: trials Anyone can view trials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view trials" ON public.trials FOR SELECT USING (true);


--
-- Name: trials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


