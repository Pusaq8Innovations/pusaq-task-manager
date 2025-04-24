# Documentación del Proyecto - API para Gestión de Proyectos, Tareas y Notas

## Resumen
Esta API RESTful, construida con **Laravel**, ofrece funcionalidades para gestionar **Proyectos**, **Tareas** y **Notas**. Incluye rutas públicas para el registro y login de usuarios, rutas privadas para la gestión de proyectos, tareas y notas, y rutas exclusivas para administradores.

---

## Rutas de la API

### 1. **Rutas Públicas**

#### 1.1. Registro de Usuario
- **Método HTTP:** `POST`
- **Ruta:** `/register`
- **Descripción:** Registra un nuevo usuario.
  
**Ejemplo de Solicitud:**
```bash
POST /register
Content-Type: application/json

{
"name":  "andres vargas",
"role":  "admin",
"email":  "andres@pusaq8.com",
"password":  "Test123#000",
"password_confirmation":  "Test123#000"
}
```

**Respuesta:**
```json
{
    "message": "User registered successfully"
}
```

#### 1.2. Login de Usuario
- **Método HTTP:** `POST`
- **Ruta:** `/login`
- **Descripción:** Inicia sesión de un usuario.
  
**Ejemplo de Solicitud:**
```bash
POST /login
Content-Type: application/json

{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

**Respuesta:**
```json
{
    "token": "JWT_TOKEN_HERE"
}
```

---

### 2. **Rutas Privadas** (requiere autenticación)

#### 2.1. Logout de Usuario
- **Método HTTP:** `POST`
- **Ruta:** `/logout`
- **Descripción:** Cierra sesión del usuario autenticado.
  
**Ejemplo de Solicitud:**
```bash
POST /logout
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "message": "Logged out successfully"
}
```

#### 2.2. Obtener Datos del Usuario
- **Método HTTP:** `GET`
- **Ruta:** `/me`
- **Descripción:** Obtiene los datos del usuario autenticado.
  
**Ejemplo de Solicitud:**
```bash
GET /me
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
}
```

---

### 3. **Rutas Generales de Usuario**

#### 3.1. Obtener Proyectos
- **Método HTTP:** `GET`
- **Ruta:** `/projects`
- **Descripción:** Obtiene todos los proyectos del usuario autenticado.

**Ejemplo de Solicitud:**
```bash
GET /projects
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "projects": [
        {
            "id": 1,
            "name": "Proyecto 1",
            "description": "Descripción del proyecto"
        }
    ]
}
```

#### 3.2. Obtener Tareas
- **Método HTTP:** `GET`
- **Ruta:** `/tasks`
- **Descripción:** Obtiene todas las tareas del usuario autenticado.

**Ejemplo de Solicitud:**
```bash
GET /tasks
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "tasks": [
        {
            "id": 1,
            "title": "Tarea 1",
            "project_id": 1,
            "status": "not_started",
            "progress": 20
        }
    ]
}
```

---

### 4. **Rutas de Notas**

#### 4.1. Obtener Notas
- **Método HTTP:** `GET`
- **Ruta:** `/notes`
- **Descripción:** Obtiene todas las notas del usuario autenticado.

**Ejemplo de Solicitud:**
```bash
GET /notes
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "notes": [
        {
            "id": 1,
            "content": "Nota 1",
            "user_id": 1,
            "project_id": 1
        }
    ]
}
```

#### 4.2. Crear una Nota
- **Método HTTP:** `POST`
- **Ruta:** `/createnote`
- **Descripción:** Crea una nueva nota para un proyecto específico.

**Ejemplo de Solicitud:**
```bash
POST /createnote
Content-Type: application/json
Authorization: Bearer JWT_TOKEN_HERE

{
    "content": "Esta es una nota importante.",
    "user_id": 1,
    "project_id": 1
}
```

**Respuesta:**
```json
{
    "message": "Note added successfully"
}
```

#### 4.3. Obtener Nota por ID
- **Método HTTP:** `GET`
- **Ruta:** `/note`
- **Descripción:** Obtiene una nota específica por su ID.

**Ejemplo de Solicitud:**
```bash
GET /note?id=1
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "note": {
        "id": 1,
        "content": "Nota importante",
        "user_id": 1,
        "project_id": 1
    }
}
```

#### 4.4. Actualizar Nota
- **Método HTTP:** `PATCH`
- **Ruta:** `/note`
- **Descripción:** Actualiza el contenido de una nota específica por su ID.

**Ejemplo de Solicitud:**
```bash
PATCH /note
Content-Type: application/json
Authorization: Bearer JWT_TOKEN_HERE

{
    "id": 1,
    "content": "Contenido actualizado de la nota"
}
```

**Respuesta:**
```json
{
    "message": "Note updated successfully"
}
```

#### 4.5. Eliminar Nota
- **Método HTTP:** `DELETE`
- **Ruta:** `/note`
- **Descripción:** Elimina una nota específica por su ID.

**Ejemplo de Solicitud:**
```bash
DELETE /note?id=1
Authorization: Bearer JWT_TOKEN_HERE
```

**Respuesta:**
```json
{
    "message": "Note deleted successfully"
}
```

---

### 5. **Rutas de Administrador**

Las siguientes rutas están disponibles solo para usuarios con el rol de **Administrador**.

#### 5.1. Crear Proyecto
- **Método HTTP:** `POST`
- **Ruta:** `/addproject`
- **Descripción:** Crea un nuevo proyecto. Solo disponible para administradores.

**Ejemplo de Solicitud:**
```bash
POST /addproject
Content-Type: application/json
Authorization: Bearer JWT_ADMIN_TOKEN_HERE

{
    "name": "Nuevo Proyecto",
    "description": "Descripción del nuevo proyecto"
}
```

**Respuesta:**
```json
{
    "message": "Project added successfully"
}
```

#### 5.2. Obtener Proyecto por ID
- **Método HTTP:** `GET`
- **Ruta:** `/project`
- **Descripción:** Obtiene los detalles de un proyecto específico por su ID. Solo disponible para administradores.

**Ejemplo de Solicitud:**
```bash
GET /project?id=1
Authorization: Bearer JWT_ADMIN_TOKEN_HERE
```

**Respuesta:**
```json
{
    "project": {
        "id": 1,
        "name": "Proyecto 1",
        "description": "Descripción del proyecto"
    }
}
```

#### 5.3. Actualizar Proyecto
- **Método HTTP:** `PATCH`
- **Ruta:** `/project`
- **Descripción:** Actualiza un proyecto específico por su ID. Solo disponible para administradores.

**Ejemplo de Solicitud:**
```bash
PATCH /project
Content-Type: application/json
Authorization: Bearer JWT_ADMIN_TOKEN_HERE

{
    "id": 1,
    "name": "Proyecto Actualizado",
    "description": "Descripción actualizada"
}
```

**Respuesta:**
```json
{
    "message": "Project updated successfully"
}
```

#### 5.4. Eliminar Proyecto
- **Método HTTP:** `DELETE`
- **Ruta:** `/project`
- **Descripción:** Elimina un proyecto específico por su ID. Solo disponible para administradores.

**Ejemplo de Solicitud:**
```bash
DELETE /project?id=1
Authorization: Bearer JWT_ADMIN_TOKEN_HERE
```

**Respuesta:**
```json
{
    "message": "Project deleted successfully"
}
```

#### 5.5. Crear Tarea
- **Método HTTP:** `POST`
- **Ruta:** `/createtask`
- **Descripción:** Crea una nueva tarea. Solo disponible para administradores.

**Ejemplo de Solicitud:**
```bash
POST /createtask
Content-Type: application/json
Authorization: Bearer JWT_ADMIN_TOKEN_HERE

{
    "project_id": 1,
    "title": "Nueva tarea",
    "user_id": 2,
    "date": "2025-04-30",
    "status": "not_started",
    "progress": 0,
    "completed": false
}
```

**Respuesta:**
```json
{
    "message": "Task added successfully"
}
```

---

## Conclusión
Esta API proporciona rutas completas para la gestión de **Proyectos**, **Tareas** y **Notas**, con autenticación basada en JWT y control de acceso para administradores. Permite a los usuarios generales interactuar con los proyectos y tareas a los que tienen acceso, mientras que los administradores tienen control completo sobre todos los recursos del sistema.

