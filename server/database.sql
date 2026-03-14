DROP TABLE IF EXISTS order_items, orders, audit_logs, products, users, categories, suppliers, customers;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Gerente', 'Vendedor') NOT NULL,
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    description TEXT,
    image MEDIUMTEXT,
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pendiente', 'Despachado') DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dispatch_info JSON,
    user_id INT,
    customer_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    table_affected VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ==========================================
-- INSERCIÓN DE DATOS DE PRUEBA (MOCK DATA)
-- ==========================================

INSERT INTO users (username, password_hash, role, avatar) VALUES
('admin', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Gerente', 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'),
('vendedor', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Vendedor', 'https://ui-avatars.com/api/?name=Vendedor&background=random'),
('gerente_ops', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Gerente', 'https://ui-avatars.com/api/?name=Gerente+Ops&background=random'),
('cajero1', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Vendedor', 'https://ui-avatars.com/api/?name=Cajero+1&background=random'),
('cajero2', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Vendedor', 'https://ui-avatars.com/api/?name=Cajero+2&background=random');

INSERT INTO categories (name, description) VALUES
('Alimentos', 'Comida seca y húmeda para mascotas'),
('Juguetes', 'Juguetes interactivos y de mordida'),
('Higiene', 'Shampoos, arenas y productos de limpieza'),
('Accesorios', 'Collares, correas y ropa'),
('Camas', 'Camas y cobijas para descanso');

INSERT INTO suppliers (name, contact_name, phone, email, address) VALUES
('Purina PetCare', 'Carlos Mendoza', '+584141234567', 'ventas@purina.ve', 'Zona Industrial, Valencia'),
('Bayer Mascotas', 'Ana Suárez', '+584129876543', 'distribucion@bayer.ve', 'Caracas, Distrito Capital'),
('Kong Company', 'Luigi Bros', '+18005551234', 'sales@kong.com', 'Miami, USA'),
('Distribuidora Peludos', 'Marcos Polo', '+584245558899', 'contacto@peludos.ve', 'Maracaibo, Zulia'),
('Pet Supplies Co.', 'Sarah Connor', '+584147773322', 'info@petsupplies.com', 'Barquisimeto, Lara');

INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '0414-1112233', 'Av. Bella Vista, Maracaibo'),
('María', 'Gómez', 'maria.gomez@email.com', '0412-4445566', 'Sector Delicias, Maracaibo'),
('Carlos', 'Ruiz', 'carlos.ruiz@email.com', '0424-7778899', 'San Francisco, Zulia'),
('Ana', 'López', 'ana.lopez@email.com', '0414-0001122', 'La Limpia, Maracaibo'),
('Luis', 'Silva', 'luis.silva@email.com', '0412-3334455', 'Cabimas, Zulia');

INSERT INTO products (name, price, stock, category, description, image, supplier_id) VALUES
('Alimento Pro Plan Adulto 3kg', 45.00, 20, 'Alimentos', 'Alimento premium para perros adultos raza mediana.', 'https://placehold.co/400x400/png?text=ProPlan', 1),
('Juguete Kong Clásico', 12.50, 15, 'Juguetes', 'Juguete de goma resistente para morder.', 'https://placehold.co/400x400/png?text=Kong', 3),
('Shampoo Antipulgas 500ml', 8.00, 30, 'Higiene', 'Shampoo suave con efecto antipulgas.', 'https://placehold.co/400x400/png?text=Shampoo', 2),
('Collar de Cuero Ajustable', 15.00, 10, 'Accesorios', 'Collar resistente y elegante para paseos.', 'https://placehold.co/400x400/png?text=Collar', 4),
('Cama Acolchada Mediana', 35.00, 5, 'Camas', 'Cama suave y lavable para mascotas.', 'https://placehold.co/400x400/png?text=Cama', 5),
('Snacks Dentastix Pedigree', 5.50, 50, 'Snacks', 'Barritas para el cuidado dental diario.', 'https://placehold.co/400x400/png?text=Dentastix', 1),
('Arena para Gatos 5kg', 9.00, 25, 'Higiene', 'Arena aglutinante con control de olores.', 'https://placehold.co/400x400/png?text=Arena+Gatos', 4);

INSERT INTO orders (client_name, total, status, user_id, customer_id) VALUES
('Juan Pérez', 45.00, 'Despachado', 2, 1),
('María Gómez', 12.50, 'Pendiente', 2, 2),
('Carlos Ruiz', 8.00, 'Pendiente', 2, 3),
('Ana López', 35.00, 'Despachado', 2, 4),
('Luis Silva', 14.50, 'Pendiente', 2, 5);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 45.00),
(2, 2, 1, 12.50),
(3, 3, 1, 8.00),
(4, 5, 1, 35.00),
(5, 6, 1, 5.50),
(5, 7, 1, 9.00);

INSERT INTO audit_logs (user_id, action, table_affected, details) VALUES
(1, 'CREATE', 'products', 'Creado producto: Alimento Pro Plan Adulto 3kg'),
(2, 'CREATE', 'orders', 'Nueva orden creada para Juan Pérez'),
(1, 'UPDATE', 'products', 'Actualizado stock de Juguete Kong Clásico'),
(2, 'CREATE', 'orders', 'Nueva orden creada para María Gómez'),
(1, 'DELETE', 'products', 'Producto eliminado (Prueba)');
