# Diccionario de Datos - Renovapet Zulia

Este documento describe la estructura relacional de la base de datos de 8 tablas diseñadas para el proyecto Renovapet Zulia (Actividad 1 - Módulo 3).

## 1. Tabla: `users`
Almacena los administradores y personal de la aplicación.
- **Índices**: `username` (UNIQUE).
- **Relaciones**: Ninguna llave foránea entrante. Actúa como tabla maestra para `orders` y `audit_logs`.

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | Identificador único del usuario | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | username | Usuario | Nombre de usuario (único) | VARCHAR | 50 | No | No | Sí | Ninguno | N/A |
| 3 | password_hash | Contraseña | Hash encriptado con bcrypt | VARCHAR | 255 | No | No | Sí | Ninguno | N/A |
| 4 | role | Rol | Privilegio: Gerente o Vendedor | ENUM | 10 | No | No | Sí | Ninguno | N/A |
| 5 | avatar | Foto | URL de la imagen de perfil | VARCHAR | 255 | No | No | No | NULL | N/A |

---

## 2. Tabla: `categories`
Almacena las categorías maestras para clasificar los productos del inventario.
- **Índices**: `name` (UNIQUE).

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | Identificador único referencial | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | name | Nombre | Nombre de la categoría | VARCHAR | 50 | No | No | Sí | Ninguno | N/A |
| 3 | description | Reseña | Detalles de la categoría | TEXT | 65535 | No | No | No | NULL | N/A |
| 4 | created_at | Fecha Creo | Fecha de registro en sistema | TIMESTAMP| - | No | No | No | CURRENT_TIMESTAMP | N/A |

---

## 3. Tabla: `suppliers`
Entidad que registra los proveedores externos de la tienda.
- **Relaciones**: Los productos pertenecen a un proveedor (`products.supplier_id`).

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | ID correlativo de sistema | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | name | Empresa | Nombre comercial | VARCHAR | 100 | No | No | Sí | Ninguno | N/A |
| 3 | contact_name | Contacto| Persona de enlace comercial | VARCHAR | 100 | No | No | No | NULL | N/A |
| 4 | phone | Teléfono| Número de contacto principal | VARCHAR | 20 | No | No | No | NULL | N/A |
| 5 | email | Correo | Correo de negocios | VARCHAR | 100 | No | No | No | NULL | N/A |
| 6 | address | Dirección| Sede principal de despachos | TEXT | 65535 | No | No | No | NULL | N/A |
| 7 | created_at | Fecha Creo| Fecha de asociación | TIMESTAMP| - | No | No | No | CURRENT_TIMESTAMP | N/A |

---

## 4. Tabla: `customers`
Agenda de clientes fijos para seguimiento de despachos.
- **Índices**: `email` (UNIQUE).

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | Serial de la base de datos | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | first_name | Nombre | Nombre de pila | VARCHAR | 50 | No | No | Sí | Ninguno | N/A |
| 3 | last_name | Apellido| Apellidos del cliente | VARCHAR | 50 | No | No | Sí | Ninguno | N/A |
| 4 | email | Correo | Email de facturación único | VARCHAR | 100 | No | No | No | NULL | N/A |
| 5 | phone | Celular | Teléfono de WhatsApp | VARCHAR | 20 | No | No | No | NULL | N/A |
| 6 | address | Dirección| Detalles de envío fijo | TEXT | 65535 | No | No | No | NULL | N/A |
| 7 | created_at | Fecha Creo| Fecha de registro inicial | TIMESTAMP| - | No | No | No | CURRENT_TIMESTAMP | N/A |

---

## 5. Tabla: `products`
Núcleo del inventario con control de precios y cantidades.
- **Relaciones**: Foreing Key a `suppliers(id)`.

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | Primary key de artículos | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | name | Producto | Nombre visible en catálogo | VARCHAR | 100 | No | No | Sí | Ninguno | N/A |
| 3 | price | Precio | Valor monetario en dólares | DECIMAL | 10,2 | No | No | Sí | Ninguno | N/A |
| 4 | stock | Existencia| Unidades físicas albergadas | INT | 11 | No | No | Sí | 0 | N/A |
| 5 | category | Rubro | Tipo de producto texto plano | VARCHAR | 50 | No | No | No | NULL | N/A |
| 6 | is_featured | Destacado| Mostrar en landing page | BOOLEAN | 1 | No | No | No | FALSE | N/A |
| 7 | description | Detalles | Reseña visible al cliente | TEXT | 65535 | No | No | No | NULL | N/A |
| 8 | image | Imagen | Base64 o URL referencial | MD_TEXT | 16M | No | No | No | NULL | N/A |
| 9 | supplier_id | Prov. ID| Referencia a entidad suppliers | INT | 11 | No | Sí | No | NULL | N/A |

---

## 6. Tabla: `orders`
Cabecera de recibos y facturación por compras generadas.
- **Relaciones**: Foreign Key a `users(id)`, Foreign Key a `customers(id)`.

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | N. Orden | Número secuencial del pedido | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | client_name | Cliente | Nombre no normalizado trans.| VARCHAR | 100 | No | No | Sí | Ninguno | N/A |
| 3 | total | Subtotal| Valor absoluto de la compra | DECIMAL | 10,2 | No | No | Sí | Ninguno | N/A |
| 4 | status | Estatus | Situación de entrega | ENUM | 10 | No | No | No | 'Pendiente' | N/A |
| 5 | created_at | Emisión | Huella de tiempo automática | TIMESTAMP| - | No | No | No | CURRENT_TIMESTAMP | N/A |
| 6 | dispatch_info | Ruta | JSON data: dir, telf, met | JSON | - | No | No | No | NULL | N/A |
| 7 | user_id | Cajero ID| Gerente/Vendedor a cargo | INT | 11 | No | Sí | No | NULL | N/A |
| 8 | customer_id | Cli. Ref | Enlace a base de datos real | INT | 11 | No | Sí | No | NULL | N/A |

---

## 7. Tabla: `order_items`
Detalle línea por línea de los productos adscritos a una orden (Relación N a N).
- **Relaciones**: FK a `orders(id)`, FK a `products(id)`.

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | L. Item | Identificador de fila | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | order_id | ID Fact.| Cabecera que agrupa al ítem | INT | 11 | No | Sí | Sí | Ninguno | N/A |
| 3 | product_id| ID Prod.| Ítem sustraído del inventario | INT | 11 | No | Sí | Sí | Ninguno | N/A |
| 4 | quantity | Cantidad| Multiplicador de sustracción| INT | 11 | No | No | Sí | Ninguno | N/A |
| 5 | price | Imp. Fila| Valor cobrado estático (Hst.) | DECIMAL | 10,2 | No | No | Sí | Ninguno | N/A |

---

## 8. Tabla: `audit_logs`
Bitácora estática de trazablidad para capturar CRUDs del sistema.
- **Relaciones**: FK a `users(id)`.

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID | Consecutivo de registro | INT | 11 | Sí | No | Sí | AUTO_INCREMENT | N/A |
| 2 | user_id | Autor ID| Usuario ejecutor del cambio | INT | 11 | No | Sí | No | NULL | N/A |
| 3 | action | Método | (POST, PUT, DELETE, LOGIN) | VARCHAR | 255 | No | No | Sí | Ninguno | N/A |
| 4 | table_affected| Entidad | Tabla manipulada | VARCHAR | 255 | No | No | No | NULL | N/A |
| 5 | details | Log info| JSON del payload modificado | TEXT | 65535 | No | No | No | NULL | N/A |
| 6 | timestamp | Ejecución| Fecha marca automática exacta | TIMESTAMP| - | No | No | No | CURRENT_TIMESTAMP | N/A |
