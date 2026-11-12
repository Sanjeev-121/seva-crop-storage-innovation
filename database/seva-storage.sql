--
-- PostgreSQL database dump
--

\restrict ecTdzZDp5wVECzJdiPAWI2ECEiib7i2O38MCx7Vr9Yp1cQwfBqzFzD8gRXKl9f7

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-12 13:23:26

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16446)
-- Name: application_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_events (
    id integer NOT NULL,
    application_id integer NOT NULL,
    status character varying(30) NOT NULL,
    note text,
    created_at timestamp without time zone
);


ALTER TABLE public.application_events OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16445)
-- Name: application_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_events_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 225
-- Name: application_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_events_id_seq OWNED BY public.application_events.id;


--
-- TOC entry 224 (class 1259 OID 16424)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    farmer_id integer NOT NULL,
    storage_id integer NOT NULL,
    crop character varying(100) NOT NULL,
    quantity_kg double precision NOT NULL,
    duration_months integer,
    status character varying(30),
    created_at timestamp without time zone
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16423)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 223
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: storages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.storages (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(50),
    district character varying(100),
    state character varying(100),
    capacity_kg double precision,
    available_kg double precision,
    min_quantity_kg double precision,
    price_per_kg_month double precision,
    other_charges text,
    contact_phone character varying(15)
);


ALTER TABLE public.storages OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: storages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.storages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.storages_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 221
-- Name: storages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.storages_id_seq OWNED BY public.storages.id;


--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    village character varying(100),
    district character varying(100),
    state character varying(100),
    role character varying(20),
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16397)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4824 (class 2604 OID 16449)
-- Name: application_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_events ALTER COLUMN id SET DEFAULT nextval('public.application_events_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16427)
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16415)
-- Name: storages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storages ALTER COLUMN id SET DEFAULT nextval('public.storages_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 16401)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4834 (class 2606 OID 16456)
-- Name: application_events application_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_events
    ADD CONSTRAINT application_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16434)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16421)
-- Name: storages storages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storages
    ADD CONSTRAINT storages_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16409)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 1259 OID 16422)
-- Name: ix_storages_district; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_storages_district ON public.storages USING btree (district);


--
-- TOC entry 4825 (class 1259 OID 16410)
-- Name: ix_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_phone ON public.users USING btree (phone);


--
-- TOC entry 4837 (class 2606 OID 16457)
-- Name: application_events application_events_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_events
    ADD CONSTRAINT application_events_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- TOC entry 4835 (class 2606 OID 16435)
-- Name: applications applications_farmer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_farmer_id_fkey FOREIGN KEY (farmer_id) REFERENCES public.users(id);


--
-- TOC entry 4836 (class 2606 OID 16440)
-- Name: applications applications_storage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_storage_id_fkey FOREIGN KEY (storage_id) REFERENCES public.storages(id);


-- Completed on 2026-11-12 13:23:26

--
-- PostgreSQL database dump complete
--

\unrestrict ecTdzZDp5wVECzJdiPAWI2ECEiib7i2O38MCx7Vr9Yp1cQwfBqzFzD8gRXKl9f7
