/**
 * Ejemplos específicos para Torre del Valor Medio
 * Contiene los ejemplos predefinidos del escenario
 */
export class EjemplosTorreValorMedio {
    constructor() {
        this.ejemplos = [
            {
                id: 'cuadratica_simetrica',
                titulo: 'Función Cuadrática Simétrica',
                descripcion: 'Una parábola centrada en el origen',
                funcion: 'x**2',
                tipoFuncion: 'cuadratica',
                limiteA: -2,
                limiteB: 2,
                puntoC: 0,
                insight: 'En funciones simétricas, el punto c está exactamente en el medio del intervalo.',
                dificultad: 'basica',
                categoria: 'simetrica',
                explicacion: {
                    enunciado: 'Para la función f(x) = x² en el intervalo [-2, 2]',
                    calculo: 'f(-2) = 4, f(2) = 4, pendiente secante = (4-4)/(2-(-2)) = 0',
                    derivada: 'f\'(x) = 2x, f\'(c) = 2c = 0, por tanto c = 0',
                    interpretacion: 'El punto c = 0 es el vértice de la parábola, donde la tangente es horizontal'
                }
            },
            {
                id: 'cubica_asimetrica',
                titulo: 'Función Cúbica Asimétrica',
                descripcion: 'Una curva con crecimiento acelerado',
                funcion: 'x**3',
                tipoFuncion: 'cubica',
                limiteA: 0,
                limiteB: 2,
                puntoC: 1.15,
                insight: 'El punto c NO está en el medio porque la función crece más rápido al final.',
                dificultad: 'intermedia',
                categoria: 'asimetrica',
                explicacion: {
                    enunciado: 'Para la función f(x) = x³ en el intervalo [0, 2]',
                    calculo: 'f(0) = 0, f(2) = 8, pendiente secante = (8-0)/(2-0) = 4',
                    derivada: 'f\'(x) = 3x², f\'(c) = 3c² = 4, por tanto c = √(4/3) ≈ 1.15',
                    interpretacion: 'El punto c está desplazado hacia la derecha debido al crecimiento acelerado'
                }
            },
            {
                id: 'trigonometrica',
                titulo: 'Función Trigonométrica',
                descripcion: 'Una onda sinusoidal',
                funcion: 'Math.sin(x)',
                tipoFuncion: 'seno',
                limiteA: 0,
                limiteB: Math.PI,
                puntoC: Math.PI / 2,
                insight: 'En funciones trigonométricas, c se encuentra donde la derivada es máxima.',
                dificultad: 'intermedia',
                categoria: 'trigonometrica',
                explicacion: {
                    enunciado: 'Para la función f(x) = sin(x) en el intervalo [0, π]',
                    calculo: 'f(0) = 0, f(π) = 0, pendiente secante = (0-0)/(π-0) = 0',
                    derivada: 'f\'(x) = cos(x), f\'(c) = cos(c) = 0, por tanto c = π/2',
                    interpretacion: 'El punto c = π/2 es donde la función alcanza su máximo'
                }
            },
            {
                id: 'lineal',
                titulo: 'Función Lineal',
                descripcion: 'Una línea recta',
                funcion: '2*x + 1',
                tipoFuncion: 'lineal',
                limiteA: 0,
                limiteB: 3,
                puntoC: 'cualquier punto',
                insight: 'En funciones lineales, cualquier punto c cumple el teorema porque la pendiente es constante.',
                dificultad: 'basica',
                categoria: 'lineal',
                explicacion: {
                    enunciado: 'Para la función f(x) = 2x + 1 en el intervalo [0, 3]',
                    calculo: 'f(0) = 1, f(3) = 7, pendiente secante = (7-1)/(3-0) = 2',
                    derivada: 'f\'(x) = 2, f\'(c) = 2 para cualquier c',
                    interpretacion: 'Cualquier punto c satisface el teorema porque la derivada es constante'
                }
            },
            {
                id: 'exponencial',
                titulo: 'Función Exponencial',
                descripcion: 'Una curva de crecimiento exponencial',
                funcion: 'Math.exp(x)',
                tipoFuncion: 'exponencial',
                limiteA: 0,
                limiteB: 2,
                puntoC: 1.26,
                insight: 'En funciones exponenciales, c se encuentra donde la derivada iguala la pendiente secante.',
                dificultad: 'avanzada',
                categoria: 'exponencial',
                explicacion: {
                    enunciado: 'Para la función f(x) = eˣ en el intervalo [0, 2]',
                    calculo: 'f(0) = 1, f(2) = e², pendiente secante = (e²-1)/(2-0) ≈ 3.19',
                    derivada: 'f\'(x) = eˣ, f\'(c) = eᶜ = 3.19, por tanto c = ln(3.19) ≈ 1.26',
                    interpretacion: 'El punto c está donde la derivada exponencial iguala la pendiente secante'
                }
            }
        ]
    }

    // ✅ OBTENER TODOS LOS EJEMPLOS
    obtenerTodosLosEjemplos() {
        return this.ejemplos
    }

    // ✅ OBTENER EJEMPLO POR ID
    obtenerEjemploPorId(id) {
        return this.ejemplos.find(ejemplo => ejemplo.id === id)
    }

    // ✅ OBTENER EJEMPLOS POR DIFICULTAD
    obtenerEjemplosPorDificultad(dificultad) {
        return this.ejemplos.filter(ejemplo => ejemplo.dificultad === dificultad)
    }

    // ✅ OBTENER EJEMPLOS POR CATEGORÍA
    obtenerEjemplosPorCategoria(categoria) {
        return this.ejemplos.filter(ejemplo => ejemplo.categoria === categoria)
    }

    // ✅ OBTENER EJEMPLOS BÁSICOS
    obtenerEjemplosBasicos() {
        return this.obtenerEjemplosPorDificultad('basica')
    }

    // ✅ OBTENER EJEMPLOS INTERMEDIOS
    obtenerEjemplosIntermedios() {
        return this.obtenerEjemplosPorDificultad('intermedia')
    }

    // ✅ OBTENER EJEMPLOS AVANZADOS
    obtenerEjemplosAvanzados() {
        return this.obtenerEjemplosPorDificultad('avanzada')
    }

    // ✅ OBTENER EJEMPLO ALEATORIO
    obtenerEjemploAleatorio() {
        const indice = Math.floor(Math.random() * this.ejemplos.length)
        return this.ejemplos[indice]
    }

    // ✅ OBTENER EJEMPLO SIGUIENTE
    obtenerEjemploSiguiente(ejemploActual) {
        const indiceActual = this.ejemplos.findIndex(e => e.id === ejemploActual.id)
        const siguienteIndice = (indiceActual + 1) % this.ejemplos.length
        return this.ejemplos[siguienteIndice]
    }

    // ✅ OBTENER EJEMPLO ANTERIOR
    obtenerEjemploAnterior(ejemploActual) {
        const indiceActual = this.ejemplos.findIndex(e => e.id === ejemploActual.id)
        const anteriorIndice = indiceActual === 0 ? this.ejemplos.length - 1 : indiceActual - 1
        return this.ejemplos[anteriorIndice]
    }

    // ✅ VERIFICAR SI EJEMPLO EXISTE
    existeEjemplo(id) {
        return this.ejemplos.some(ejemplo => ejemplo.id === id)
    }

    // ✅ OBTENER ESTADÍSTICAS DE EJEMPLOS
    obtenerEstadisticas() {
        const total = this.ejemplos.length
        const porDificultad = {
            basica: this.obtenerEjemplosBasicos().length,
            intermedia: this.obtenerEjemplosIntermedios().length,
            avanzada: this.obtenerEjemplosAvanzados().length
        }
        const porCategoria = {
            simetrica: this.obtenerEjemplosPorCategoria('simetrica').length,
            asimetrica: this.obtenerEjemplosPorCategoria('asimetrica').length,
            trigonometrica: this.obtenerEjemplosPorCategoria('trigonometrica').length,
            lineal: this.obtenerEjemplosPorCategoria('lineal').length,
            exponencial: this.obtenerEjemplosPorCategoria('exponencial').length
        }

        return {
            total,
            porDificultad,
            porCategoria
        }
    }

    // ✅ OBTENER EXPLICACIÓN DETALLADA
    obtenerExplicacionDetallada(ejemploId) {
        const ejemplo = this.obtenerEjemploPorId(ejemploId)
        if (!ejemplo) return null

        return {
            ...ejemplo.explicacion,
            funcion: ejemplo.funcion,
            intervalo: `[${ejemplo.limiteA}, ${ejemplo.limiteB}]`,
            puntoC: ejemplo.puntoC,
            insight: ejemplo.insight
        }
    }

    // ✅ OBTENER PASOS DE RESOLUCIÓN
    obtenerPasosResolucion(ejemploId) {
        const ejemplo = this.obtenerEjemploPorId(ejemploId)
        if (!ejemplo) return []

        const pasos = [
            {
                numero: 1,
                titulo: 'Identificar la función y el intervalo',
                descripcion: `Función: f(x) = ${ejemplo.funcion}, Intervalo: [${ejemplo.limiteA}, ${ejemplo.limiteB}]`
            },
            {
                numero: 2,
                titulo: 'Calcular f(a) y f(b)',
                descripcion: `f(${ejemplo.limiteA}) y f(${ejemplo.limiteB})`
            },
            {
                numero: 3,
                titulo: 'Calcular la pendiente secante',
                descripcion: `Pendiente = (f(b) - f(a)) / (b - a)`
            },
            {
                numero: 4,
                titulo: 'Encontrar la derivada',
                descripcion: `f'(x) = derivada de f(x)`
            },
            {
                numero: 5,
                titulo: 'Resolver f'(c) = pendiente secante',
                descripcion: `Encontrar c tal que f'(c) = pendiente secante`
            }
        ]

        return pasos
    }

    // ✅ OBTENER CONSEJOS
    obtenerConsejos(ejemploId) {
        const ejemplo = this.obtenerEjemploPorId(ejemploId)
        if (!ejemplo) return []

        const consejos = []

        switch (ejemplo.categoria) {
            case 'simetrica':
                consejos.push('En funciones simétricas, c suele estar en el centro del intervalo')
                consejos.push('Busca puntos donde la derivada sea cero')
                break
            case 'asimetrica':
                consejos.push('En funciones asimétricas, c se desplaza hacia donde crece más rápido')
                consejos.push('La derivada debe igualar la pendiente secante')
                break
            case 'trigonometrica':
                consejos.push('En funciones trigonométricas, c está donde la derivada es máxima o mínima')
                consejos.push('Recuerda que cos(x) = 0 cuando x = π/2 + kπ')
                break
            case 'lineal':
                consejos.push('En funciones lineales, cualquier punto c satisface el teorema')
                consejos.push('La derivada es constante, igual a la pendiente secante')
                break
            case 'exponencial':
                consejos.push('En funciones exponenciales, usa logaritmos para resolver')
                consejos.push('La derivada de eˣ es eˣ')
                break
        }

        return consejos
    }

    // ✅ OBTENER EJERCICIOS SIMILARES
    obtenerEjerciciosSimilares(ejemploId) {
        const ejemplo = this.obtenerEjemploPorId(ejemploId)
        if (!ejemplo) return []

        return this.ejemplos.filter(e => 
            e.id !== ejemploId && 
            (e.categoria === ejemplo.categoria || e.dificultad === ejemplo.dificultad)
        )
    }

    // ✅ BUSCAR EJEMPLOS
    buscarEjemplos(termino) {
        const terminoLower = termino.toLowerCase()
        return this.ejemplos.filter(ejemplo => 
            ejemplo.titulo.toLowerCase().includes(terminoLower) ||
            ejemplo.descripcion.toLowerCase().includes(terminoLower) ||
            ejemplo.categoria.toLowerCase().includes(terminoLower)
        )
    }

    // ✅ OBTENER EJEMPLOS RECOMENDADOS
    obtenerEjemplosRecomendados(nivelUsuario = 'basico') {
        const recomendaciones = []

        switch (nivelUsuario) {
            case 'basico':
                recomendaciones.push(...this.obtenerEjemplosBasicos())
                break
            case 'intermedio':
                recomendaciones.push(...this.obtenerEjemplosBasicos())
                recomendaciones.push(...this.obtenerEjemplosIntermedios())
                break
            case 'avanzado':
                recomendaciones.push(...this.ejemplos)
                break
        }

        return recomendaciones
    }
}


