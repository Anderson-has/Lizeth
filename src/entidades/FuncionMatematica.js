/**
 * ENTIDAD: FuncionMatematica
 * RESPONSABILIDAD: Representar una función matemática con sus propiedades
 */
export class FuncionMatematica {
  constructor(tipo, parametros = {}) {
    // Forma 1: new FuncionMatematica("cuadratica", { a: 1, b: 0, c: 0 })
    // Forma 2: new FuncionMatematica("x^2", (x) => x * x)

    if (typeof parametros === "function") {
      // Forma 2: expresión y función de evaluación personalizada
      this.expresion = tipo
      this.evaluarCustom = parametros
      this.tipo = "custom"
      this.parametros = {}
    } else {
      // Forma 1: tipo y parámetros tradicionales
      this.tipo = tipo
      this.parametros = parametros
      this.expresion = this.generarExpresion()
      this.evaluarCustom = null
    }

    this.dominio = { inicio: -10, fin: 10 }
    this.rango = { min: -10, max: 10 }
  }

  generarExpresion() {
    switch (this.tipo) {
      case "lineal":
        return `${this.parametros.m}x + ${this.parametros.b}`
      case "cuadratica":
        return `${this.parametros.a}x² + ${this.parametros.b}x + ${this.parametros.c}`
      case "cubica":
        return `${this.parametros.a}x³ + ${this.parametros.b}x² + ${this.parametros.c}x + ${this.parametros.d}`
      case "seno":
        return `${this.parametros.a}sin(${this.parametros.b}x + ${this.parametros.c}) + ${this.parametros.d}`
      case "coseno":
        return `${this.parametros.a}cos(${this.parametros.b}x + ${this.parametros.c}) + ${this.parametros.d}`
      default:
        return "f(x)"
    }
  }

  evaluar(x) {
    if (this.evaluarCustom) {
      return this.evaluarCustom(x)
    }

    switch (this.tipo) {
      case "lineal":
        return this.parametros.m * x + this.parametros.b
      case "cuadratica":
        return this.parametros.a * x * x + this.parametros.b * x + this.parametros.c
      case "cubica":
        return this.parametros.a * x * x * x + this.parametros.b * x * x + this.parametros.c * x + this.parametros.d
      case "seno":
        return this.parametros.a * Math.sin(this.parametros.b * x + this.parametros.c) + this.parametros.d
      case "coseno":
        return this.parametros.a * Math.cos(this.parametros.b * x + this.parametros.c) + this.parametros.d
      case "exponencial":
        return this.parametros.a * Math.exp(this.parametros.b * x) + this.parametros.c
      case "logaritmica":
        return this.parametros.a * Math.log(x) + this.parametros.b
      case "raiz":
        return this.parametros.a * Math.sqrt(x) + this.parametros.b
      case "constante":
        return this.parametros.c || 0
      default:
        return 0
    }
  }

  obtenerDerivada() {
    switch (this.tipo) {
      case "lineal":
        return new FuncionMatematica("constante", { c: this.parametros.m })
      case "cuadratica":
        return new FuncionMatematica("lineal", {
          m: 2 * this.parametros.a,
          b: this.parametros.b,
        })
      case "seno":
        return new FuncionMatematica("coseno", {
          a: this.parametros.a * this.parametros.b,
          b: this.parametros.b,
          c: this.parametros.c,
          d: 0,
        })
      default:
        return null
    }
  }

  obtenerIntegral() {
    switch (this.tipo) {
      case "lineal":
        return new FuncionMatematica("cuadratica", {
          a: this.parametros.m / 2,
          b: this.parametros.b,
          c: 0,
        })
      case "cuadratica":
        return new FuncionMatematica("cubica", {
          a: this.parametros.a / 3,
          b: this.parametros.b / 2,
          c: this.parametros.c,
          d: 0,
        })
      default:
        return null
    }
  }

  validarDominio(x) {
    return x >= this.dominio.inicio && x <= this.dominio.fin
  }
}
