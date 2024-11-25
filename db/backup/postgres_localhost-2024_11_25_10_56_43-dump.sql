--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 14.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: adonis_schema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adonis_schema (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    batch integer NOT NULL,
    migration_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.adonis_schema OWNER TO postgres;

--
-- Name: adonis_schema_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adonis_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adonis_schema_id_seq OWNER TO postgres;

--
-- Name: adonis_schema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adonis_schema_id_seq OWNED BY public.adonis_schema.id;


--
-- Name: adonis_schema_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adonis_schema_versions (
    version integer NOT NULL
);


ALTER TABLE public.adonis_schema_versions OWNER TO postgres;

--
-- Name: auth_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_access_tokens (
    id integer NOT NULL,
    tokenable_id uuid NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255),
    hash character varying(255) NOT NULL,
    abilities text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_used_at timestamp with time zone,
    expires_at timestamp with time zone
);


ALTER TABLE public.auth_access_tokens OWNER TO postgres;

--
-- Name: auth_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_access_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_access_tokens_id_seq OWNER TO postgres;

--
-- Name: auth_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_access_tokens_id_seq OWNED BY public.auth_access_tokens.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    address character varying(255),
    city character varying(255),
    state character varying(255),
    zip character varying(255),
    country character varying(255),
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT clients_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    client_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    address character varying(255),
    city character varying(255),
    state character varying(255),
    zip character varying(255),
    country character varying(255),
    photo character varying(255),
    job_title character varying(255),
    department_id uuid NOT NULL,
    client_id uuid NOT NULL,
    manager_id uuid,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employees_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    client_id uuid NOT NULL,
    role_id uuid,
    permission_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_permissions_id_seq OWNER TO postgres;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    role_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(254) NOT NULL,
    password character varying(255) NOT NULL,
    client_id uuid NOT NULL,
    employee_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: adonis_schema id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adonis_schema ALTER COLUMN id SET DEFAULT nextval('public.adonis_schema_id_seq'::regclass);


--
-- Name: auth_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.auth_access_tokens_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Data for Name: adonis_schema; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adonis_schema (id, name, batch, migration_time) FROM stdin;
1	database/migrations/1732328733100_create_clients_table	1	2024-11-25 10:31:54.074213+05
2	database/migrations/1732328733101_create_departments_table	2	2024-11-25 10:33:23.222111+05
3	database/migrations/1732328733102_create_employees_table	2	2024-11-25 10:33:23.251706+05
4	database/migrations/1732328733112_create_users_table	2	2024-11-25 10:33:23.26716+05
5	database/migrations/1732328733116_create_access_tokens_table	2	2024-11-25 10:33:23.281278+05
6	database/migrations/1732364739113_create_roles_table	2	2024-11-25 10:33:23.296236+05
7	database/migrations/1732364740049_create_permissions_table	2	2024-11-25 10:33:23.306357+05
8	database/migrations/1732364740976_create_user_roles_table	2	2024-11-25 10:33:23.31836+05
9	database/migrations/1732364741903_create_role_permissions_table	2	2024-11-25 10:33:23.332207+05
\.


--
-- Data for Name: adonis_schema_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adonis_schema_versions (version) FROM stdin;
2
\.


--
-- Data for Name: auth_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_access_tokens (id, tokenable_id, type, name, hash, abilities, created_at, updated_at, last_used_at, expires_at) FROM stdin;
1	0ef56299-e290-441b-9b2b-0e97eb3d777b	auth_token	\N	d7dc727fa30fb61a7139ef556f067e0841eeecab8da061cb38fc9623a0c98872	["*"]	2024-11-25 10:49:44.025+05	2024-11-25 10:49:44.025+05	2024-11-25 10:50:58.944+05	\N
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, email, phone, address, city, state, zip, country, status, created_at, updated_at) FROM stdin;
d6caba7c-fd03-4317-8d32-0aa836defbbd	Client 1	hammadrana@test.com	\N	\N	\N	\N	\N	\N	active	2024-11-25 10:34:25.171612+05	2024-11-25 10:34:25.171612+05
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, description, client_id, created_at, updated_at) FROM stdin;
4472304f-ddff-44c8-92b5-bccd2dab9a9d	Engineering	\N	d6caba7c-fd03-4317-8d32-0aa836defbbd	2024-11-25 10:35:49.423896+05	2024-11-25 10:35:49.423896+05
1aa479c7-e47f-4f49-b41c-6decd5d11966	QA	\N	d6caba7c-fd03-4317-8d32-0aa836defbbd	2024-11-25 10:35:49.423896+05	2024-11-25 10:35:49.423896+05
06d9089d-ceca-4837-8d3e-f4d3f71ae29e	GRC	\N	d6caba7c-fd03-4317-8d32-0aa836defbbd	2024-11-25 10:35:49.423896+05	2024-11-25 10:35:49.423896+05
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, first_name, last_name, email, phone, address, city, state, zip, country, photo, job_title, department_id, client_id, manager_id, status, created_at, updated_at) FROM stdin;
a1cd2d49-8e3c-401a-ae55-1159f1452f70	Hammad	Rana	hammadrana@test.com	\N	\N	\N	\N	\N	\N	\N	\N	4472304f-ddff-44c8-92b5-bccd2dab9a9d	d6caba7c-fd03-4317-8d32-0aa836defbbd	a1cd2d49-8e3c-401a-ae55-1159f1452f70	active	2024-11-25 10:38:15.604519+05	2024-11-25 10:38:15.604519+05
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, client_id, name, created_at, updated_at) FROM stdin;
a870a5f5-1396-4eff-acf2-af6dd0118d9b	d6caba7c-fd03-4317-8d32-0aa836defbbd	Create	2024-11-25 10:39:52.894131+05	2024-11-25 10:39:52.894131+05
418d5db3-7472-4fa7-9bb1-f3f238c67341	d6caba7c-fd03-4317-8d32-0aa836defbbd	Delete	2024-11-25 10:39:52.894131+05	2024-11-25 10:39:52.894131+05
6a9c1d95-7a0c-44dc-bf88-d533c493068b	d6caba7c-fd03-4317-8d32-0aa836defbbd	Read	2024-11-25 10:39:52.894131+05	2024-11-25 10:39:52.894131+05
fe2ffcc8-47a7-4df3-acdc-fc2757f9a4b7	d6caba7c-fd03-4317-8d32-0aa836defbbd	Update	2024-11-25 10:39:52.894131+05	2024-11-25 10:39:52.894131+05
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, client_id, role_id, permission_id, created_at, updated_at) FROM stdin;
9	d6caba7c-fd03-4317-8d32-0aa836defbbd	b883a0c1-e66c-48aa-9df2-b712d7c94034	a870a5f5-1396-4eff-acf2-af6dd0118d9b	2024-11-25 10:43:53.542449+05	2024-11-25 10:43:53.542449+05
10	d6caba7c-fd03-4317-8d32-0aa836defbbd	b883a0c1-e66c-48aa-9df2-b712d7c94034	418d5db3-7472-4fa7-9bb1-f3f238c67341	2024-11-25 10:43:53.542449+05	2024-11-25 10:43:53.542449+05
11	d6caba7c-fd03-4317-8d32-0aa836defbbd	b883a0c1-e66c-48aa-9df2-b712d7c94034	6a9c1d95-7a0c-44dc-bf88-d533c493068b	2024-11-25 10:43:53.542449+05	2024-11-25 10:43:53.542449+05
12	d6caba7c-fd03-4317-8d32-0aa836defbbd	b883a0c1-e66c-48aa-9df2-b712d7c94034	fe2ffcc8-47a7-4df3-acdc-fc2757f9a4b7	2024-11-25 10:43:53.542449+05	2024-11-25 10:43:53.542449+05
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, client_id, name, created_at, updated_at) FROM stdin;
b883a0c1-e66c-48aa-9df2-b712d7c94034	d6caba7c-fd03-4317-8d32-0aa836defbbd	Admin	2024-11-25 10:39:21.082602+05	2024-11-25 10:39:21.082602+05
fe2ffcc8-47a7-4df3-acdc-fc2756f9a4b7	d6caba7c-fd03-4317-8d32-0aa836defbbd	User	2024-11-25 10:39:21.082602+05	2024-11-25 10:39:21.082602+05
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, client_id, user_id, role_id, created_at, updated_at) FROM stdin;
1	d6caba7c-fd03-4317-8d32-0aa836defbbd	0ef56299-e290-441b-9b2b-0e97eb3d777b	b883a0c1-e66c-48aa-9df2-b712d7c94034	2024-11-25 10:47:36.625855+05	2024-11-25 10:47:36.625855+05
2	d6caba7c-fd03-4317-8d32-0aa836defbbd	a8128cd1-5ceb-4412-b10e-abe569c22abf	fe2ffcc8-47a7-4df3-acdc-fc2756f9a4b7	2024-11-25 10:49:21.623616+05	2024-11-25 10:49:21.623616+05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, client_id, employee_id, created_at, updated_at) FROM stdin;
0ef56299-e290-441b-9b2b-0e97eb3d777b	hammadrana@test.com	$scrypt$n=16384,r=8,p=1$GGHxk/I1mYCMv/wCtW2GPQ$rLsGfYPX3HYci5hXqh/cBg66LHXhU8me2Vsvs5yAVJvJTBUfh20zeYq8uq8OQvC55mUw1EDKxkfQA6YD2bDl6Q	d6caba7c-fd03-4317-8d32-0aa836defbbd	a1cd2d49-8e3c-401a-ae55-1159f1452f70	2024-11-25 10:45:54.928+05	2024-11-25 10:45:54.928+05
a8128cd1-5ceb-4412-b10e-abe569c22abf	hammad+user@test.com	$scrypt$n=16384,r=8,p=1$zcTNOB9bjGWas6F+Qbo/WA$DK349KaDsDgjmpn3wR5Uxh853ATMXZTO4/yzjL5+0hwjUTTNd86Cme7PT4YgqREas/A0HrjvMNoAMMjMSQsUwQ	d6caba7c-fd03-4317-8d32-0aa836defbbd	a1cd2d49-8e3c-401a-ae55-1159f1452f70	2024-11-25 10:48:44.101+05	2024-11-25 10:48:44.101+05
\.


--
-- Name: adonis_schema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adonis_schema_id_seq', 9, true);


--
-- Name: auth_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_access_tokens_id_seq', 1, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 12, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 2, true);


--
-- Name: adonis_schema adonis_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adonis_schema
    ADD CONSTRAINT adonis_schema_pkey PRIMARY KEY (id);


--
-- Name: adonis_schema_versions adonis_schema_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adonis_schema_versions
    ADD CONSTRAINT adonis_schema_versions_pkey PRIMARY KEY (version);


--
-- Name: auth_access_tokens auth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_access_tokens
    ADD CONSTRAINT auth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: clients clients_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_unique UNIQUE (email);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: departments departments_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_unique UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employees employees_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_unique UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_unique UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: auth_access_tokens auth_access_tokens_tokenable_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_access_tokens
    ADD CONSTRAINT auth_access_tokens_tokenable_id_foreign FOREIGN KEY (tokenable_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: departments departments_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: employees employees_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: employees employees_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_foreign FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;


--
-- Name: employees employees_manager_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_manager_id_foreign FOREIGN KEY (manager_id) REFERENCES public.employees(id);


--
-- Name: permissions permissions_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: roles roles_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: users users_employee_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

