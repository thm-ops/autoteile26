CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    manufacturer_part_number TEXT,
    price TEXT NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'EUR',
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_tags (
    product_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (product_id, tag_id),
    CONSTRAINT fk_product_tags_product
        FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_product_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_products_brand ON products (brand);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_product_tags_tag_id ON product_tags (tag_id);

CREATE INDEX idx_tags_name_trgm
    ON tags
    USING GIN (name gin_trgm_ops);

CREATE INDEX idx_products_name_trgm
    ON products
    USING GIN (name gin_trgm_ops);

CREATE INDEX idx_products_description_trgm
    ON products
    USING GIN (description gin_trgm_ops);