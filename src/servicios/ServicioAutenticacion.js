/**
 * SERVICIO: ServicioAutenticacion
 * RESPONSABILIDAD: Gestionar autenticación, registro y sesiones de usuarios
 * SRP: Solo maneja la lógica de autenticación, no almacena datos persistentes
 */
import { Usuario } from '../entidades/Usuario.js'
import { Estudiante } from '../entidades/Estudiante.js'
import { Docente } from '../entidades/Docente.js'

export class ServicioAutenticacion {
  constructor() {
    this.usuarios = this.cargarUsuarios()
    this.usuarioActual = null
    this.sesionActiva = false
  }

  cargarUsuarios() {
    try {
      // Verificar si estamos en el cliente
      if (typeof window !== 'undefined') {
        const usuariosGuardados = localStorage.getItem('usuarios_integra_learn')
        if (usuariosGuardados) {
          const datos = JSON.parse(usuariosGuardados)
          return datos.map(usuarioData => {
            if (usuarioData.tipoUsuario === 'estudiante') {
              return new Estudiante(usuarioData)
            } else if (usuarioData.tipoUsuario === 'docente') {
              return new Docente(usuarioData)
            }
            return new Usuario(usuarioData)
          })
        }
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
    
    // Crear usuarios demo por defecto
    return this.crearUsuariosDemo()
  }

  crearUsuariosDemo() {
    const usuariosDemo = [
      new Estudiante({
        primerNombre: 'María',
        segundoNombre: 'Elena',
        primerApellido: 'García',
        segundoApellido: 'López',
        nombreUsuario: 'maria.garcia',
        correo: 'maria@universidad.edu.co',
        contrasena: 'estudiante123',
        tipoUsuario: 'estudiante',
        semestre: 5,
        escenariosHabilitados: ['jardinRiemann', 'puenteTeorema', 'torreValorMedio']
      }),
      new Docente({
        primerNombre: 'Sergio',
        segundoNombre: 'Alejandro',
        primerApellido: 'Rodríguez',
        segundoApellido: 'Martínez',
        nombreUsuario: 'sergio.rodriguez',
        correo: 'sergio@universidad.edu.co',
        contrasena: 'docente123',
        tipoUsuario: 'docente'
      })
    ]

    this.guardarUsuarios(usuariosDemo)
    return usuariosDemo
  }

  guardarUsuarios(usuarios) {
    try {
      // Verificar si estamos en el cliente
      if (typeof window !== 'undefined') {
        const datos = usuarios.map(usuario => usuario.toJSON())
        localStorage.setItem('usuarios_integra_learn', JSON.stringify(datos))
      }
    } catch (error) {
      console.error('Error guardando usuarios:', error)
    }
  }

  registrarUsuario(datosUsuario) {
    // Validar que no exista el correo o nombre de usuario
    const usuarioExistente = this.usuarios.find(u => 
      u.correo === datosUsuario.correo || u.nombreUsuario === datosUsuario.nombreUsuario
    )

    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con este correo o nombre de usuario')
    }

    // Crear usuario según el tipo
    let nuevoUsuario
    if (datosUsuario.tipoUsuario === 'estudiante') {
      nuevoUsuario = new Estudiante(datosUsuario)
    } else if (datosUsuario.tipoUsuario === 'docente') {
      nuevoUsuario = new Docente(datosUsuario)
    } else {
      nuevoUsuario = new Usuario(datosUsuario)
    }

    // Validar datos
    const errores = nuevoUsuario.validarDatos()
    if (errores.length > 0) {
      throw new Error(errores.join(', '))
    }

    // Agregar usuario
    this.usuarios.push(nuevoUsuario)
    this.guardarUsuarios(this.usuarios)

    return nuevoUsuario
  }

  iniciarSesion(correo, contrasena) {
    const usuario = this.usuarios.find(u => 
      u.correo === correo && u.contrasena === contrasena && u.activo
    )

    if (!usuario) {
      throw new Error('Credenciales incorrectas o usuario inactivo')
    }

    this.usuarioActual = usuario
    this.sesionActiva = true

    // Guardar sesión en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sesion_activa', JSON.stringify({
        usuarioId: usuario.id,
        fechaInicio: new Date(),
        activa: true
      }))
    }

    return usuario
  }

  cerrarSesion() {
    this.usuarioActual = null
    this.sesionActiva = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sesion_activa')
    }
  }

  obtenerUsuarioActual() {
    if (!this.sesionActiva) {
      // Intentar recuperar sesión desde localStorage
      if (typeof window !== 'undefined') {
        const sesionGuardada = localStorage.getItem('sesion_activa')
        if (sesionGuardada) {
          try {
            const sesion = JSON.parse(sesionGuardada)
            const usuario = this.usuarios.find(u => u.id === sesion.usuarioId)
            if (usuario && usuario.activo) {
              this.usuarioActual = usuario
              this.sesionActiva = true
              return usuario
            }
          } catch (error) {
            console.error('Error recuperando sesión:', error)
          }
        }
      }
      return null
    }
    return this.usuarioActual
  }

  estaAutenticado() {
    return this.sesionActiva && this.usuarioActual !== null
  }

  obtenerTodosLosUsuarios() {
    return this.usuarios
  }

  obtenerEstudiantes() {
    return this.usuarios.filter(u => u.esEstudiante())
  }

  obtenerDocentes() {
    return this.usuarios.filter(u => u.esDocente())
  }

  eliminarUsuario(usuarioId) {
    const indice = this.usuarios.findIndex(u => u.id === usuarioId)
    if (indice !== -1) {
      this.usuarios.splice(indice, 1)
      this.guardarUsuarios(this.usuarios)
      return true
    }
    return false
  }

  actualizarUsuario(usuarioId, datosActualizados) {
    const usuario = this.usuarios.find(u => u.id === usuarioId)
    if (usuario) {
      Object.assign(usuario, datosActualizados)
      this.guardarUsuarios(this.usuarios)
      return usuario
    }
    return null
  }

  verificarPermisos(permiso) {
    if (!this.usuarioActual || !this.usuarioActual.esDocente()) {
      return false
    }
    return this.usuarioActual.permisos[permiso] || false
  }
}
