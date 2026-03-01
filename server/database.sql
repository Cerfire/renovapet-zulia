DROP TABLE IF EXISTS order_items, orders, audit_logs, products, users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Gerente', 'Vendedor') NOT NULL,
    avatar VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    description TEXT,
    image MEDIUMTEXT
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pendiente', 'Despachado') DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dispatch_info JSON,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
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

INSERT INTO users (username, password_hash, role, avatar) VALUES
('admin', '$2b$10$3qoSe0C4/eRVLtVLrdq0bOihLvQQInnOOAewFLQS6RRb/2O9W5Gju', 'Gerente', 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'),
('vendedor', '$2b$10$yu76SCC81UnYjl1xLf3JHOihvB3m4lahO1XWSD5NrU2gAy2JpvHxi', 'Vendedor', 'https://ui-avatars.com/api/?name=Vendedor&background=random');

INSERT INTO products (name, price, stock, category, description, image) VALUES
('Alimento Pro Plan Adulto 3kg', 45.00, 20, 'Alimentos', 'Alimento premium para perros adultos raza mediana.', 'https://placehold.co/400x400/png?text=ProPlan'),
('Juguete Kong Clásico', 12.50, 15, 'Juguetes', 'Juguete de goma resistente para morder.', 'https://placehold.co/400x400/png?text=Kong'),
('Shampoo Antipulgas 500ml', 8.00, 30, 'Higiene', 'Shampoo suave con efecto antipulgas.', 'https://placehold.co/400x400/png?text=Shampoo'),
('Collar de Cuero Ajustable', 15.00, 10, 'Accesorios', 'Collar resistente y elegante para paseos.', 'https://placehold.co/400x400/png?text=Collar'),
('Cama Acolchada Mediana', 35.00, 5, 'Camas', 'Cama suave y lavable para mascotas.', 'https://placehold.co/400x400/png?text=Cama'),
('Snacks Dentastix Pedigree', 5.50, 50, 'Snacks', 'Barritas para el cuidado dental diario.', 'https://placehold.co/400x400/png?text=Dentastix'),
('Arena para Gatos 5kg', 9.00, 25, 'Higiene', 'Arena aglutinante con control de olores.', 'https://placehold.co/400x400/png?text=Arena+Gatos');

INSERT INTO orders (client_name, total, status, user_id) VALUES
('Juan Pérez', 45.00, 'Despachado', 2),
('María Gómez', 12.50, 'Pendiente', 2),
('Carlos Ruiz', 8.00, 'Pendiente', 2),
('Ana López', 35.00, 'Despachado', 2),
('Luis Silva', 14.50, 'Pendiente', 2);

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
