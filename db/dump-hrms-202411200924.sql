PGDMP     )        	        
    |            hrms %   14.13 (Ubuntu 14.13-0ubuntu0.22.04.1) %   14.13 (Ubuntu 14.13-0ubuntu0.22.04.1)     '           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            (           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            )           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            *           1262    16384    hrms    DATABASE     Y   CREATE DATABASE hrms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE hrms;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            +           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    16441    roles    TABLE     �  CREATE TABLE public.roles (
    id integer NOT NULL,
    created_at timestamp(6) without time zone,
    description character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT roles_name_check CHECK (((name)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying, 'SUPER_ADMIN'::character varying])::text[])))
);
    DROP TABLE public.roles;
       public         heap    postgres    false    3            �            1259    16425 	   roles_seq    SEQUENCE     s   CREATE SEQUENCE public.roles_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
     DROP SEQUENCE public.roles_seq;
       public          postgres    false    3            �            1259    16449    users    TABLE     ;  CREATE TABLE public.users (
    id integer NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(100) NOT NULL,
    full_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    role_id integer NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    3            �            1259    16405 	   users_seq    SEQUENCE     s   CREATE SEQUENCE public.users_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
     DROP SEQUENCE public.users_seq;
       public          postgres    false    3            #          0    16441    roles 
   TABLE DATA                 public          postgres    false    211   	       $          0    16449    users 
   TABLE DATA                 public          postgres    false    212   �       ,           0    0 	   roles_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.roles_seq', 101, true);
          public          postgres    false    210            -           0    0 	   users_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.users_seq', 201, true);
          public          postgres    false    209            �           2606    16448    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    211            �           2606    16459 "   users uk_6dotkott2kjsp8vw4d0m25fb7 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);
 L   ALTER TABLE ONLY public.users DROP CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7;
       public            postgres    false    212            �           2606    16457 "   roles uk_ofx66keruapi6vyqpv6f2or37 
   CONSTRAINT     ]   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uk_ofx66keruapi6vyqpv6f2or37 UNIQUE (name);
 L   ALTER TABLE ONLY public.roles DROP CONSTRAINT uk_ofx66keruapi6vyqpv6f2or37;
       public            postgres    false    211            �           2606    16455    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    212            �           2606    16460 !   users fkp56c1712k691lhsyewcssf40f    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fkp56c1712k691lhsyewcssf40f FOREIGN KEY (role_id) REFERENCES public.roles(id);
 K   ALTER TABLE ONLY public.users DROP CONSTRAINT fkp56c1712k691lhsyewcssf40f;
       public          postgres    false    3214    211    212            #   �   x���v
Q���W((M��L�+��I-Vs�	uV�05�QP7202�54�54W02�20�25ճ�Pʸ��%��(��)�t�C�f��֦i��I�Zc\�-M@F;��f�e�%��#,vt����i3P'QV��0�drpiЧحp���K��� f�_�      $   �   x����N�@E�<�,H��30�Ǎ��J�h��q7RF:�vf���F�F����{��4H� ������u��#���)H���
h�D���f&���nZS�qٔGR0��%z����>�*"*4�|뇭9E�N�l���C�W���t���I�G;���J[��^+��� �/����ֹ����Q������;ô^@�w����{��\z�͈���]�j��;Ǭu��Rr�����]Q>s�jw     