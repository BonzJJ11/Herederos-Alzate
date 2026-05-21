# Herederos Alzate - Sistema de Gestión

Sistema web fullstack para la gestión de **inventario de calzado** y **empleados** de la empresa Herederos Alzate. Desarrollado con **Django REST Framework** en el backend y **Angular** en el frontend.

---

## Descripción del proyecto

Este sistema permite:

- **Autenticación**: login, recuperación de contraseña por código y cambio de contraseña
- **Inventario de calzado**: registrar, editar y consultar calzado con sus categorías
- **Movimiento de stock**: registrar entradas y salidas de productos
- **Empleados**: registrar y editar información del personal
- **Proveedores**: agregar, consultar y editar proveedores
- **Dashboard (Home)**: vista general del sistema
- **Perfil de usuario**: gestión del perfil

---

## Tecnologías utilizadas

### Backend

- **Python 3.13**
- **Django**
- **Django REST Framework**
- **PostgreSQL**
- **djangorestframework-simplejwt**
- **django-cors-headers**

### Frontend

- **Angular 17+**
- **TypeScript**
- **HTML5 / CSS3**

---

## Estructura del proyecto

```
Herederos Alzate/
└── Backend/
    ├── core/                          # Configuración principal Django
    │   ├── settings.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    │
    ├── herederos/                     # App principal Django
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   ├── urls.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── authentication.py
    │   └── tests.py
    │
    ├── PPI-master/                    # Proyecto Angular (Frontend)
    │   └── src/
    │       ├── index.html
    │       ├── main.ts
    │       ├── styles.css
    │       ├── environments/
    │       │   └── environment.ts
    │       └── app/
    │           ├── app.ts
    │           ├── app.routes.ts
    │           ├── app.config.ts
    │           │
    │           ├── compartido/
    │           │   └── disenos/
    │           │       ├── layout-principal/   # Navbar, Sidebar, Footer (admin)
    │           │       └── layout-usuario/     # Navbar y Sidebar de usuario
    │           │
    │           ├── nucleo/
    │           │   ├── guardias/
    │           │   │   └── auth.guard.ts
    │           │   └── servicios/
    │           │       ├── auth.service.ts
    │           │       └── calzado.service.ts
    │           │
    │           └── paginas/
    │               ├── funcionalidades/
    │               │   ├── autenticacion/
    │               │   │   ├── login/
    │               │   │   ├── codigo-recuperacion/
    │               │   │   └── nueva-contrasena/
    │               │   ├── empleados/
    │               │   │   ├── registrar-empleado/
    │               │   │   └── editar-empleado/
    │               │   ├── inventario/
    │               │   │   ├── calzado/
    │               │   │   └── categorias/
    │               │   └── prove/
    │               │       ├── proveedores/
    │               │       └── agregar-proveedor/
    │               ├── home/
    │               ├── splash/
    │               ├── perfil/
    │               ├── nuevo-calzado/
    │               ├── editar-calzado/
    │               ├── nueva-categoria/
    │               ├── editar-categoria/
    │               ├── editar-proveedores/
    │               ├── agregar-entrada/
    │               ├── agregar-salida/
    │               └── movimiento-stock/
    │
    ├── venv/                          # Entorno virtual Python (no se sube)
    └── manage.py
```

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Python 3.13+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/herederos-alzate.git
cd "herederos-alzate/Backend"
```

### 2. Crear y activar el entorno virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar en Windows (PowerShell)
venv\Scripts\Activate.ps1

# Activar en Mac/Linux
source venv/bin/activate
```

### 3. Instalar dependencias del backend

```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install psycopg2-binary
```

O si existe `requirements.txt`:

```bash
pip install -r requirements.txt
```

> Para generar el `requirements.txt` con tus paquetes actuales:
>
> ```bash
> pip freeze > requirements.txt
> ```

### 4. Configurar la base de datos PostgreSQL

En `core/settings.py`, ajusta la configuración:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'herederos_db',
        'USER': 'tu_usuario_postgres',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 5. Aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario

```bash
python manage.py createsuperuser
```

### 7. Ejecutar el servidor backend

```bash
python manage.py runserver
```

Backend disponible en: `http://localhost:8000`

---

### 8. Instalar dependencias del frontend

```bash
cd PPI-master
npm install
```

### 9. Ejecutar el frontend

```bash
ng serve
```

Frontend disponible en: `http://localhost:4200`

---

## Paquetes pip principales

| Paquete                         | Descripción                                     |
| ------------------------------- | ----------------------------------------------- |
| `django`                        | Framework web backend                           |
| `djangorestframework`           | Construcción de la API REST                     |
| `djangorestframework-simplejwt` | Autenticación con tokens JWT                    |
| `django-cors-headers`           | Permite la comunicación con el frontend Angular |
| `psycopg2-binary`               | Driver de conexión con PostgreSQL               |

---

## Rutas del Frontend (Angular)

| Ruta                   | Descripción                |
| ---------------------- | -------------------------- |
| `/splash`              | Pantalla de bienvenida     |
| `/login`               | Inicio de sesión           |
| `/codigo-recuperacion` | Recuperación de contraseña |
| `/nueva-contrasena`    | Cambiar contraseña         |
| `/home`                | Dashboard principal        |
| `/perfil`              | Perfil del usuario         |
| `/calzado`             | Lista de calzado           |
| `/nuevo-calzado`       | Registrar calzado          |
| `/editar-calzado`      | Editar calzado             |
| `/categorias`          | Lista de categorías        |
| `/nueva-categoria`     | Crear categoría            |
| `/agregar-entrada`     | Registrar entrada de stock |
| `/agregar-salida`      | Registrar salida de stock  |
| `/movimiento-stock`    | Historial de movimientos   |
| `/proveedores`         | Lista de proveedores       |
| `/agregar-proveedor`   | Registrar proveedor        |
| `/editar-proveedores`  | Editar proveedor           |
| `/registrar-empleado`  | Registrar empleado         |
| `/editar-empleado`     | Editar empleado            |

---
