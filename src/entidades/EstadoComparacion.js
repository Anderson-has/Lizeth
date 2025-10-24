/**
 * ENTIDAD: EstadoComparacion
 * RESPONSABILIDAD: Solo almacenar y gestionar datos de estado para la propiedad de comparación
 * SRP: Solo maneja datos, no realiza cálculos ni renderizado
 */
export class EstadoComparacion {
    constructor() {
        // Límites de integración
        this.limiteA = 0
        this.limiteB = 1

        // Funciones a comparar
        this.funcionF = "x"      // f(x)
        this.funcionG = "x²"     // g(x)

        // Resultados de cálculo
        this.integralF = 0       // ∫[a→b] f(x)dx
        this.integralG = 0       // ∫[a→b] g(x)dx
        this.diferencia = 0      // integralF - integralG

        // Verificación de la propiedad
        this.verificacion = null
        this.esValida = false
        this.mensajeVerificacion = ""

        // Datos del gráfico
        this.datosGrafico = []
        this.puntoHover = null

        // Estado de validación
        this.limitesValidos = true
    }

    // Getters
    obtenerLimites() {
        return { a: this.limiteA, b: this.limiteB }
    }

    obtenerFunciones() {
        return { f: this.funcionF, g: this.funcionG }
    }

    obtenerResultados() {
        return {
            integralF: this.integralF,
            integralG: this.integralG,
            diferencia: this.diferencia
        }
    }

    obtenerVerificacion() {
        return {
            esValida: this.esValida,
            mensaje: this.mensajeVerificacion
        }
    }

    obtenerDatosGrafico() {
        return this.datosGrafico
    }

    obtenerPuntoHover() {
        return this.puntoHover
    }

    // Setters
    actualizarLimites(a, b) {
        this.limiteA = a
        this.limiteB = b
        this.validarLimites()
    }

    actualizarFunciones(funcionF, funcionG) {
        this.funcionF = funcionF
        this.funcionG = funcionG
    }

    establecerResultados(integralF, integralG, diferencia) {
        this.integralF = integralF
        this.integralG = integralG
        this.diferencia = diferencia
    }

    establecerVerificacion(verificacion) {
        this.verificacion = verificacion
        this.esValida = verificacion.esValida
        this.mensajeVerificacion = verificacion.mensaje
    }

    establecerDatosGrafico(datos) {
        this.datosGrafico = datos
    }

    establecerPuntoHover(punto) {
        this.puntoHover = punto
    }

    limpiarPuntoHover() {
        this.puntoHover = null
    }

    // Validación
    validarLimites() {
        this.limitesValidos = this.limiteA !== this.limiteB
    }

    // Reiniciar
    reiniciar() {
        this.limiteA = 0
        this.limiteB = 1
        this.funcionF = "x"
        this.funcionG = "x²"
        this.integralF = 0
        this.integralG = 0
        this.diferencia = 0
        this.verificacion = null
        this.esValida = false
        this.mensajeVerificacion = ""
        this.datosGrafico = []
        this.puntoHover = null
        this.limitesValidos = true
    }
}
