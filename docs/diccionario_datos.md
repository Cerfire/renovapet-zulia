# Diccionario de Datos - Renovapet Zulia

Este documento describe la estructura relacional de la base de datos de 8 tablas diseñadas para el proyecto Renovapet Zulia (Actividad 1 - Módulo 3), adaptado al formato formal de Diccionario de Datos.

---

## 1. Módulo: Autenticación / Personal

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `users`
* **Alias:** Usuarios
* **Descripción:** Almacena los administradores y personal de la aplicación con sus niveles de acceso (roles).

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_USER | Identificador único del usuario | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | username | USERNAME | Nombre de usuario de acceso | VARCHAR | 50 | | | X | | 13/03/2026 |
| 3 | password_hash | PASSWORD | Contraseña encriptada (bcrypt) | VARCHAR | 255 | | | X | | 13/03/2026 |
| 4 | role | ROL | Nivel de privilegio del sistema | ENUM | 10 | | | X | | 13/03/2026 |
| 5 | avatar | AVATAR | Enlace de foto de perfil | VARCHAR | 255 | | | | NULL | 13/03/2026 |

**Información Claves Foráneas**
No aplica para esta tabla.

---

## 2. Módulo: Inventario

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `categories`
* **Alias:** Categorías
* **Descripción:** Almacena los rubros o familias para clasificar los productos del inventario.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_CAT | Identificador único referencial | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | name | NOMBRE | Nombre de la categoría | VARCHAR | 50 | | | X | | 13/03/2026 |
| 3 | description | DESCRIPCION | Detalles de la categoría | TEXT | 65535 | | | | NULL | 13/03/2026 |
| 4 | created_at | FECHA_CREA | Fecha de registro en sistema | TIMESTAMP| - | | | | CURRENT_TIMEST | 13/03/2026 |

**Información Claves Foráneas**
No aplica para esta tabla.

---

## 3. Módulo: Proveedores

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `suppliers`
* **Alias:** Proveedores
* **Descripción:** Entidad que registra atributos y vías de contacto de proveedores externos aliados.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_PROV | ID correlativo de sistema | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | name | EMPRESA | Nombre comercial corporativo | VARCHAR | 100 | | | X | | 13/03/2026 |
| 3 | contact_name | CONTACTO | Persona de enlace comercial | VARCHAR | 100 | | | | NULL | 13/03/2026 |
| 4 | phone | TELEFONO | Número de contacto principal | VARCHAR | 20 | | | | NULL | 13/03/2026 |
| 5 | email | CORREO | Correo electrónico de negocios| VARCHAR | 100 | | | | NULL | 13/03/2026 |
| 6 | address | DIRECCION | Sede física principal | TEXT | 65535 | | | | NULL | 13/03/2026 |
| 7 | created_at | FECHA_CREA | Marca temporal de asociación | TIMESTAMP| - | | | | CURRENT_TIMEST | 13/03/2026 |

**Información Claves Foráneas**
No aplica para esta tabla.

---

## 4. Módulo: Gestión de Clientes

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `customers`
* **Alias:** Clientes
* **Descripción:** Base de datos de clientes registrados para vinculación rápida en facturación.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_CLI | Serial de la base de datos | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | first_name | NOMBRE | Nombre de pila del cliente | VARCHAR | 50 | | | X | | 13/03/2026 |
| 3 | last_name | APELLIDO | Apellidos completos | VARCHAR | 50 | | | X | | 13/03/2026 |
| 4 | email | CORREO | Email único del cliente | VARCHAR | 100 | | | | NULL | 13/03/2026 |
| 5 | phone | CELULAR | Teléfono móvil de contacto | VARCHAR | 20 | | | | NULL | 13/03/2026 |
| 6 | address | DIRECCION | Localización predeterminada | TEXT | 65535 | | | | NULL | 13/03/2026 |
| 7 | created_at | FECHA_CREA | Fecha del registro inicial | TIMESTAMP| - | | | | CURRENT_TIMEST | 13/03/2026 |

**Información Claves Foráneas**
No aplica para esta tabla.

---

## 5. Módulo: Inventario Principal

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `products`
* **Alias:** Productos
* **Descripción:** Núcleo central del inventario con detalles, precios, existencias y multimedia.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_PROD | Llave primaria de artículos | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | name | PRODUCTO | Denominación del artículo | VARCHAR | 100 | | | X | | 13/03/2026 |
| 3 | price | PRECIO | Valor unitario comercial | DECIMAL | 10,2 | | | X | | 13/03/2026 |
| 4 | stock | STOCK | Piezas disponibles físicas | INT | 11 | | | X | 0 | 13/03/2026 |
| 5 | category | CATEGORIA | Nombre de la categoría | VARCHAR | 50 | | | | NULL | 13/03/2026 |
| 6 | is_featured | DESTACADO | Marcar para vista en Landing | BOOLEAN | 1 | | | | FALSE | 13/03/2026 |
| 7 | description | DETALLES | Reseña visible descriptiva | TEXT | 65535 | | | | NULL | 13/03/2026 |
| 8 | image | IMAGEN | URL o cadena Base64 foto | MD_TEXT | 16M | | | | NULL | 13/03/2026 |
| 9 | supplier_id | ID_PROV | Referencia clave del proveedor| INT | 11 | | X | | NULL | 13/03/2026 |

**Información Claves Foráneas**

| Nombre Clave | Tabla Foránea | Campo en tabla padre | Campo en tabla foránea |
|--------------|---------------|----------------------|------------------------|
| FK_product_supplier | suppliers | supplier_id | id |

---

## 6. Módulo: Ventas y Pedidos

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `orders`
* **Alias:** Órdenes (Cabecera)
* **Descripción:** Cabecera maestra que engloba un pedido realizado, los totales financieros y ruta logística.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | NUM_ORDEN | Número unívoco del pedido | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | client_name | NOM_CLIENTE | Texto libre del comprador | VARCHAR | 100 | | | X | | 13/03/2026 |
| 3 | total | MONTO_TOTAL | Pago global consolidado | DECIMAL | 10,2 | | | X | | 13/03/2026 |
| 4 | status | ESTATUS | Control de logística actual | ENUM | 10 | | | | 'Pendiente' | 13/03/2026 |
| 5 | created_at | EMISION | Tiempo de concretar venta | TIMESTAMP| - | | | | CURRENT_TIMEST | 13/03/2026 |
| 6 | dispatch_info | INFO_RUTA | Estructura JSON con logística| JSON | - | | | | NULL | 13/03/2026 |
| 7 | user_id | VENDEDOR | Cajero o Gerente emisor | INT | 11 | | X | | NULL | 13/03/2026 |
| 8 | customer_id | ID_CLI | Cliente fijo asociado | INT | 11 | | X | | NULL | 13/03/2026 |

**Información Claves Foráneas**

| Nombre Clave | Tabla Foránea | Campo en tabla padre | Campo en tabla foránea |
|--------------|---------------|----------------------|------------------------|
| FK_order_user | users | user_id | id |
| FK_order_customer| customers | customer_id | id |

---

## 7. Módulo: Detalle de Ventas

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `order_items`
* **Alias:** Detalles de Orden
* **Descripción:** Desglose transaccional que entrelaza la orden con los productos sustraídos del inventario.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | L_ITEM | Serial incrementable fila | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | order_id | ID_FACTURA | Raíz de la orden adjudicada | INT | 11 | | X | X | | 13/03/2026 |
| 3 | product_id| ID_PROD | Identificador artículo movido | INT | 11 | | X | X | | 13/03/2026 |
| 4 | quantity | CANTIDAD | Multiplicador unitario vendido| INT | 11 | | | X | | 13/03/2026 |
| 5 | price | IMPORTE | Precio estático transaccional | DECIMAL | 10,2 | | | X | | 13/03/2026 |

**Información Claves Foráneas**

| Nombre Clave | Tabla Foránea | Campo en tabla padre | Campo en tabla foránea |
|--------------|---------------|----------------------|------------------------|
| FK_item_order | orders | order_id | id |
| FK_item_product| products | product_id | id |

---

## 8. Módulo: Sistema y Auditoría

**Información General**
* **Fecha de Creación:** 13/03/2026
* **Fecha de Modificación:** 13/03/2026

**Información de la Tabla**
* **Nombre:** `audit_logs`
* **Alias:** Bitácora
* **Descripción:** Observatorio estático inmutable para transacciones, manipulación de CRUDs y eventos globales.

**Información de lo(s) Campo(s)**

| Id | Campo | Alias | Descripción | Tipo | Long. | Primary | Foreign | Not Null | Valor Defecto | Fecha Modificación |
|----|-------|-------|-------------|------|-------|---------|---------|----------|---------------|--------------------|
| 1 | id | ID_LOG | Secuencia temporal ordinal | INT | 11 | X | | X | AUTO_INCREMENT | 13/03/2026 |
| 2 | user_id | ID_RESPONSABEL| Empleado causante del evento | INT | 11 | | X | | NULL | 13/03/2026 |
| 3 | action | TRANSACCION| Tipificación (POST, PUT, DEL) | VARCHAR | 255 | | | X | | 13/03/2026 |
| 4 | table_affected| ENTIDAD | Esfera o tabla comprometida | VARCHAR | 255 | | | | NULL | 13/03/2026 |
| 5 | details | PAYLOAD | Metadatos y JSON del suceso | TEXT | 65535 | | | | NULL | 13/03/2026 |
| 6 | timestamp | FECHA_HORA | Marca de tiempo automatizada | TIMESTAMP| - | | | | CURRENT_TIMEST | 13/03/2026 |

**Información Claves Foráneas**

| Nombre Clave | Tabla Foránea | Campo en tabla padre | Campo en tabla foránea |
|--------------|---------------|----------------------|------------------------|
| FK_audit_user | users | user_id | id |
