# Sistema de Autenticación y Gestión de Usuarios - IntegraLearn

## Descripción General

Este sistema implementa un sistema completo de autenticación con roles diferenciados para estudiantes y docentes en la plataforma IntegraLearn. Incluye funcionalidades de registro, login, gestión de usuarios, seguimiento de progreso y sistema de logros.

## Características Principales

### 🔐 Sistema de Autenticación
- **Login seguro** con validación de credenciales
- **Registro de usuarios** con modal interactivo
- **Roles diferenciados**: Estudiante y Docente
- **Sesiones persistentes** con localStorage
- **Protección de rutas** automática

### 👨‍🎓 Funcionalidades para Estudiantes
- **Dashboard personalizado** con progreso individual
- **Seguimiento de tiempo** en cada escenario
- **Sistema de logros** y certificaciones
- **Historial de actividades** detallado
- **Progreso por escenario** con métricas

### 👨‍🏫 Funcionalidades para Docentes
- **Dashboard administrativo** completo
- **Gestión de estudiantes** (ver, eliminar usuarios)
- **Configuración de escenarios** (habilitar/deshabilitar)
- **Reportes y análisis** de progreso
- **Visualización de logros** de estudiantes
- **Estadísticas generales** de la clase

## Estructura del Sistema

### Entidades Principales

#### Usuario (Base)
```javascript
- id: string
- primerNombre: string
- segundoNombre?: string
- primerApellido: string
- segundoApellido?: string
- nombreUsuario: string
- correo: string
- contrasena: string
- tipoUsuario: 'estudiante' | 'docente'
- fechaRegistro: Date
- activo: boolean
```

#### Estudiante (Extiende Usuario)
```javascript
- semestre: number
- progreso: {
  escenariosCompletados: string[]
  tiempoTotal: number
  logros: string[]
  ultimaActividad: Date
}
- escenariosHabilitados: string[]
- historialActividad: Activity[]
```

#### Docente (Extiende Usuario)
```javascript
- estudiantesAsignados: string[]
- escenariosConfigurados: Object
- permisos: {
  gestionarEstudiantes: boolean
  configurarEscenarios: boolean
  verReportes: boolean
  eliminarUsuarios: boolean
}
```

### Servicios Principales

#### ServicioAutenticacion
- Gestión de usuarios y sesiones
- Validación de credenciales
- Registro y login
- Persistencia en localStorage

#### GestorProgresoEstudiantes
- Seguimiento de tiempo y actividades
- Generación de reportes
- Análisis de progreso
- Recomendaciones personalizadas

#### GestorLogros
- Sistema de logros y certificaciones
- Verificación automática de criterios
- Diferentes tipos de logros (tiempo, completitud, especial)
- Estadísticas de logros

## Páginas y Componentes

### Páginas
- **`/login`** - Página de autenticación con modal de registro
- **`/`** - Dashboard del estudiante (protegida)
- **`/dashboard-docente`** - Panel de control del docente (protegida)

### Componentes Principales
- **`AuthContext`** - Contexto global de autenticación
- **`ProtectedRoute`** - Componente de protección de rutas
- **`ProgresoEstudiante`** - Visualización de progreso y logros
- **`Sidebar`** - Navegación lateral

## Flujo de Autenticación

1. **Acceso inicial**: Usuario accede a `/login`
2. **Registro**: Modal con formulario diferenciado por tipo de usuario
3. **Login**: Validación de credenciales
4. **Redirección automática**:
   - Estudiantes → `/` (Dashboard estudiante)
   - Docentes → `/dashboard-docente` (Panel docente)
5. **Protección de rutas**: Verificación automática de permisos

## Sistema de Logros

### Tipos de Logros
- **Tiempo**: Basados en tiempo total de uso
- **Completitud**: Completar escenarios específicos
- **Especiales**: Logros únicos (primer acceso, explorador)
- **Secuenciales**: Completar escenarios en orden específico

### Criterios de Verificación
- Verificación automática al realizar actividades
- Diferentes niveles de rareza (común, raro, épico, legendario)
- Sistema de puntos y certificaciones

## Funcionalidades del Docente

### Gestión de Estudiantes
- Lista completa de estudiantes
- Visualización de progreso individual
- Eliminación de usuarios (con permisos)
- Estadísticas generales

### Configuración de Escenarios
- Habilitar/deshabilitar escenarios
- Control granular de acceso
- Configuración por escenario

### Reportes y Análisis
- Tiempo promedio de uso
- Escenarios más populares
- Actividad reciente
- Progreso general de la clase

## Seguridad y Validaciones

### Validaciones de Registro
- Campos obligatorios
- Formato de correo electrónico
- Contraseñas coincidentes
- Usuarios únicos (correo y nombre de usuario)

### Protección de Rutas
- Verificación de autenticación
- Verificación de roles
- Redirección automática

### Persistencia de Datos
- Almacenamiento local (localStorage)
- Datos de sesión seguros
- Recuperación automática de sesión

## Cuentas de Demostración

### Estudiante Demo
- **Correo**: maria@universidad.edu.co
- **Contraseña**: estudiante123
- **Acceso**: Completo a simulaciones

### Docente Demo
- **Correo**: sergio@universidad.edu.co
- **Contraseña**: docente123
- **Acceso**: Panel de control docente

## Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconografía
- **LocalStorage** - Persistencia de datos

## Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceder a la aplicación**:
   - Navegar a `http://localhost:3000`
   - Será redirigido automáticamente a `/login`

## Arquitectura

El sistema sigue principios de **Programación Orientada a Objetos (POO)** con:
- **Separación de responsabilidades** (SRP)
- **Entidades bien definidas**
- **Servicios especializados**
- **Contextos React para estado global**

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:
- Nuevos tipos de logros
- Funcionalidades adicionales para docentes
- Integración con sistemas externos
- Escalabilidad de usuarios
