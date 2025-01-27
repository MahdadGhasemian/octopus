-- =================== Creating Databases ====================
CREATE DATABASE auth;
CREATE DATABASE storage;
CREATE DATABASE store;

-- =================== Creating Tables =======================

-- Connect to the 'auth' database and create tables
\connect auth;

-- Create tables
CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "tag" character varying, "path" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"));
CREATE TABLE "access" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "image" character varying, "color" character varying, "cannot_be_deleted" boolean NOT NULL DEFAULT false, "has_full_access" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"));
CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "full_name" character varying, "hashed_password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"));
CREATE TABLE "access_endpoints_endpoint" ("accessId" integer NOT NULL, "endpointId" integer NOT NULL, CONSTRAINT "PK_75796db4fb099937e686b71432f" PRIMARY KEY ("accessId", "endpointId"));
CREATE INDEX "IDX_cc58302148b06adab01b8ac62b" ON "access_endpoints_endpoint" ("accessId");
CREATE INDEX "IDX_b99954274131944840c08a95fa" ON "access_endpoints_endpoint" ("endpointId");
CREATE TABLE "user_accesses_access" ("userId" integer NOT NULL, "accessId" integer NOT NULL, CONSTRAINT "PK_c4efa7a403bc528f7a67903d555" PRIMARY KEY ("userId", "accessId"));
CREATE INDEX "IDX_cad89ffd92c0e424f53d5f455a" ON "user_accesses_access" ("userId");
CREATE INDEX "IDX_2e73445e27ba4a120d52cc6a8a" ON "user_accesses_access" ("accessId");
ALTER TABLE "access_endpoints_endpoint" ADD CONSTRAINT "FK_cc58302148b06adab01b8ac62bc" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "access_endpoints_endpoint" ADD CONSTRAINT "FK_b99954274131944840c08a95fab" FOREIGN KEY ("endpointId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_accesses_access" ADD CONSTRAINT "FK_cad89ffd92c0e424f53d5f455a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_accesses_access" ADD CONSTRAINT "FK_2e73445e27ba4a120d52cc6a8a4" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Connect to the 'storage' database and create tables
\connect storage;

-- Create tables
CREATE TABLE "private_file" ("id" SERIAL NOT NULL, "object_name" character varying, "bucket_name" character varying, "url" character varying NOT NULL, "description" character varying, "user_id" integer NOT NULL, CONSTRAINT "PK_6ef35c8eae2d9df2959ef4227de" PRIMARY KEY ("id"));

-- Connect to the 'store' database and create tables
\connect store;

-- Create tables
CREATE TYPE "public"."payment_payment_status_enum" AS ENUM('pending', 'failed', 'paid');
CREATE TABLE "payment" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "paid_date" TIMESTAMP, "payment_status" "public"."payment_payment_status_enum" NOT NULL DEFAULT 'pending', "order_id" integer NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"));
CREATE TYPE "public"."order_order_status_enum" AS ENUM('pending', 'paid', 'processing', 'completed', 'cancelled');
CREATE TABLE "order" ("id" SERIAL NOT NULL, "order_date" TIMESTAMP NOT NULL, "user_id" integer NOT NULL, "total_bill_amount" numeric(10,2) NOT NULL DEFAULT '0', "order_status" "public"."order_order_status_enum" NOT NULL DEFAULT 'pending', "is_paid" boolean NOT NULL DEFAULT false, "note" character varying NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"));
CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "order_id" integer, "product_id" integer, "quantity" integer NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"));
CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "category_id" integer, "price" integer NOT NULL, "sale_price" integer NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"));
CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"));
ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "order_item" ADD CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- =================== Seed Data ==============================

-- Connect to the 'auth' database and create tables
\connect auth;

-- Insert data into the 'access' table
INSERT INTO "access" (title, image, color, cannot_be_deleted, has_full_access)
VALUES 
    ('Admin Access', 'http://www.localhost/image/1', '#3471eb', true, true),
    ('Internal Access', 'http://www.localhost/image/2', '#3440eb', false, false),
    ('User Access', 'http://www.localhost/image/3', '#43eb34', false, false);

-- Insert data into the 'endpoint' table
INSERT INTO "endpoint" (tag, path, method) 
VALUES 
    ('Get Access List', '/accesses', 'GET'), -- 1
    ('Get User List', '/users', 'GET'),      -- 2
    ('Create User', '/users', 'POST'),       -- 3
    ('Get User', '/users', 'GET'),           -- 4
    ('Patch User', '/users', 'PATCH');       -- 5

-- Insert data into the 'user' table
INSERT INTO "user" (email, full_name, hashed_password) 
VALUES 
    ('admin@example.com', 'Michael Smith', '28818b440504a6e13be1.d20b427a2dc23bafb3525303f51dbe582095231d3354d883b817c82aecec6e83'),     -- 1
    ('internal@example.com', 'Isabella Moore', '28818b440504a6e13be1.d20b427a2dc23bafb3525303f51dbe582095231d3354d883b817c82aecec6e83'), -- 2
    ('user1@example.com', 'Sophia Taylor', '28818b440504a6e13be1.d20b427a2dc23bafb3525303f51dbe582095231d3354d883b817c82aecec6e83'),     -- 3
    ('user2@example.com', 'Alexander Johnson', '28818b440504a6e13be1.d20b427a2dc23bafb3525303f51dbe582095231d3354d883b817c82aecec6e83'); -- 4

-- Insert data into the 'access_endpoints_endpoint' table (mapping access to endpoints)
INSERT INTO "access_endpoints_endpoint" ("accessId", "endpointId") 
VALUES
    (2, 1),  -- Internal Access -> Get Access List
    (2, 2),  -- Internal Access -> Get User List
    (2, 3),  -- Internal Access -> Create User
    (2, 4);  -- Internal Access -> Get User

-- Insert data into the 'user_accesses_access' table (mapping users to accesses)
INSERT INTO "user_accesses_access" ("userId", "accessId") 
VALUES
    (1, 1),  -- Admin User -> Admin Access
    (2, 2),  -- Internal User -> Internal Access
    (3, 3);  -- Regular User -> User Access

-- Connect to the 'store' database and create tables
\connect store;

-- Insert data into the 'category' table
INSERT INTO "category" (name, description, image) 
VALUES 
    ('Category 1', 'Description 1', 'http://www.localhost/image/4'), -- 1
    ('Category 2', 'Description 2', 'http://www.localhost/image/5'); -- 2


-- Insert data into the 'category' table
INSERT INTO "product" (name, description, image, category_id, price, sale_price, is_active) 
VALUES 
    ('Product 1', 'Description 1', 'http://www.localhost/image/6', 1, 93, 89, true),
    ('Product 2', 'Description 2', 'http://www.localhost/image/7', 1, 112, 99, false),
    ('Product 3', 'Description 3', 'http://www.localhost/image/7', 2, 40, 39, true);