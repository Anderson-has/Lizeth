/**
 * ENTIDAD: Usuario
 * RESPONSABILIDAD: Representar un usuario del sistema con sus datos básicos
 * SRP: Solo maneja los datos y comportamiento básico de un usuario
 */
export class Usuario {
  constructor(datos) {
    this.id = datos.id || this.generarId()
    this.primerNombre = datos.primerNombre
    this.segundoNombre = datos.segundoNombre
    this.primerApellido = datos.primerApellido
    this.segundoApellido = datos.segundoApellido
    this.nombreUsuario = datos.nombreUsuario
    this.correo = datos.correo
    this.contrasena = datos.contrasena
    this.tipoUsuario = datos.tipoUsuario // 'estudiante' o 'docente'
    this.semestre = datos.semestre || null
    this.fechaRegistro = datos.fechaRegistro || new Date()
    this.activo = datos.activo !== undefined ? datos.activo : true
  }

  generarId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  obtenerNombreCompleto() {
    const nombres = [this.primerNombre, this.segundoNombre].filter(Boolean).join(' ')
    const apellidos = [this.primerApellido, this.segundoApellido].filter(Boolean).join(' ')
    return `${nombres} ${apellidos}`.trim()
  }

  esDocente() {
    return this.tipoUsuario === 'docente'
  }

  esEstudiante() {
    return this.tipoUsuario === 'estudiante'
  }

  validarDatos() {
    const errores = []
    
    if (!this.primerNombre?.trim()) errores.push('El primer nombre es requerido')
    if (!this.primerApellido?.trim()) errores.push('El primer apellido es requerido')
    if (!this.nombreUsuario?.trim()) errores.push('El nombre de usuario es requerido')
    if (!this.correo?.trim()) errores.push('El correo electrónico es requerido')
    if (!this.contrasena?.trim()) errores.push('La contraseña es requerida')
    if (!this.tipoUsuario) errores.push('El tipo de usuario es requerido')
    
    if (this.esEstudiante() && !this.semestre) {
      errores.push('El semestre es requerido para estudiantes')
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (this.correo && !emailRegex.test(this.correo)) {
      errores.push('El formato del correo electrónico no es válido')
    }

    return errores
  }

  toJSON() {
    return {
      id: this.id,
      primerNombre: this.primerNombre,
      segundoNombre: this.segundoNombre,
      primerApellido: this.primerApellido,
      segundoApellido: this.segundoApellido,
      nombreUsuario: this.nombreUsuario,
      correo: this.correo,
      contrasena: this.contrasena,
      tipoUsuario: this.tipoUsuario,
      semestre: this.semestre,
      fechaRegistro: this.fechaRegistro,
      activo: this.activo
    }
  }
}
