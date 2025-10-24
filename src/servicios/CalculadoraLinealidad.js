/**
 * SERVICIO: CalculadoraLinealidad
 * RESPONSABILIDAD: Calcular integrales y verificar la propiedad de linealidad
 * SRP: Solo maneja cálculos matemáticos, no presentación ni estado
 */
export class CalculadoraLinealidad {
  constructor() {
    this.funciones = this.inicializarFunciones()
  }

  inicializarFunciones() {
    return {
      "x": {
        nombre: "x",
        calcular: (x) => x,
        integral: (a, b) => (b * b - a * a) / 2
      },
      "x²": {
        nombre: "x²",
        calcular: (x) => x * x,
        integral: (a, b) => (b * b * b - a * a * a) / 3
      },
      "x³": {
        nombre: "x³",
        calcular: (x) => x * x * x,
        integral: (a, b) => (b * b * b * b - a * a * a * a) / 4
      },
      "sin(x)": {
        nombre: "sin(x)",
        calcular: (x) => Math.sin(x),
        integral: (a, b) => -Math.cos(b) + Math.cos(a)
      },
      "cos(x)": {
        nombre: "cos(x)",
        calcular: (x) => Math.cos(x),
        integral: (a, b) => Math.sin(b) - Math.sin(a)
      },
      "√x": {
        nombre: "√x",
        calcular: (x) => Math.sqrt(Math.max(0, x)),
        integral: (a, b) => (2 * Math.pow(b, 1.5) - 2 * Math.pow(Math.max(0, a), 1.5)) / 3
      },
      "eˣ": {
        nombre: "eˣ",
        calcular: (x) => Math.exp(x),
        integral: (a, b) => Math.exp(b) - Math.exp(a)
      }
    }
  }

  // Calcular integral de f(x)
  calcularIntegralF(fFuncion, limiteA, limiteB) {
    const funcion = this.funciones[fFuncion]
    if (!funcion) {
      throw new Error(`Función ${fFuncion} no encontrada`)
    }
    return funcion.integral(limiteA, limiteB)
  }

  // Calcular integral de g(x)
  calcularIntegralG(gFuncion, limiteA, limiteB) {
    const funcion = this.funciones[gFuncion]
    if (!funcion) {
      throw new Error(`Función ${gFuncion} no encontrada`)
    }
    return funcion.integral(limiteA, limiteB)
  }

  // Calcular combinación lineal αf(x) + βg(x)
  calcularCombinacionLineal(fFuncion, gFuncion, alpha, beta, x) {
    const f = this.funciones[fFuncion]
    const g = this.funciones[gFuncion]
    
    if (!f || !g) {
      throw new Error("Funciones no encontradas")
    }
    
    return alpha * f.calcular(x) + beta * g.calcular(x)
  }

  // Calcular integral de la combinación lineal
  calcularIntegralCombinada(fFuncion, gFuncion, alpha, beta, limiteA, limiteB) {
    const integralF = this.calcularIntegralF(fFuncion, limiteA, limiteB)
    const integralG = this.calcularIntegralG(gFuncion, limiteA, limiteB)
    
    return alpha * integralF + beta * integralG
  }

  // Verificar la propiedad de linealidad
  verificarPropiedad(fFuncion, gFuncion, alpha, beta, limiteA, limiteB, tolerancia = 0.001) {
    try {
      // Lado izquierdo: ∫[a,b] (αf(x) + βg(x)) dx
      const ladoIzquierdo = this.calcularIntegralCombinada(fFuncion, gFuncion, alpha, beta, limiteA, limiteB)
      
      // Lado derecho: α∫[a,b] f(x) dx + β∫[a,b] g(x) dx
      const integralF = this.calcularIntegralF(fFuncion, limiteA, limiteB)
      const integralG = this.calcularIntegralG(gFuncion, limiteA, limiteB)
      const ladoDerecho = alpha * integralF + beta * integralG
      
      // Verificar igualdad
      const diferencia = Math.abs(ladoIzquierdo - ladoDerecho)
      const esValida = diferencia < tolerancia
      
      return {
        ladoIzquierdo,
        ladoDerecho,
        diferencia,
        esValida,
        tolerancia
      }
    } catch (error) {
      return {
        ladoIzquierdo: 0,
        ladoDerecho: 0,
        diferencia: Infinity,
        esValida: false,
        tolerancia,
        error: error.message
      }
    }
  }

  // Obtener todos los cálculos necesarios
  calcularTodos(fFuncion, gFuncion, alpha, beta, limiteA, limiteB, tolerancia = 0.001) {
    try {
      const integralF = this.calcularIntegralF(fFuncion, limiteA, limiteB)
      const integralG = this.calcularIntegralG(gFuncion, limiteA, limiteB)
      const integralCombinada = this.calcularIntegralCombinada(fFuncion, gFuncion, alpha, beta, limiteA, limiteB)
      
      const verificacion = this.verificarPropiedad(fFuncion, gFuncion, alpha, beta, limiteA, limiteB, tolerancia)
      
      return {
        integralF,
        integralG,
        integralCombinada,
        alphaFIntegral: alpha * integralF,
        betaGIntegral: beta * integralG,
        verificacion
      }
    } catch (error) {
      return {
        integralF: 0,
        integralG: 0,
        integralCombinada: 0,
        alphaFIntegral: 0,
        betaGIntegral: 0,
        verificacion: {
          ladoIzquierdo: 0,
          ladoDerecho: 0,
          diferencia: Infinity,
          esValida: false,
          tolerancia,
          error: error.message
        }
      }
    }
  }

  // Obtener función por clave
  obtenerFuncion(clave) {
    return this.funciones[clave] || null
  }

  // Obtener todas las funciones disponibles
  obtenerFuncionesDisponibles() {
    return Object.keys(this.funciones)
  }
}
