/**
 * ENTIDAD: ConfiguracionPTFC
 * RESPONSABILIDAD: Solo almacenar configuraciones del Primer Teorema Fundamental del Cálculo
 * SRP: Solo configuraciones, no lógica de negocio ni presentación
 */
export class ConfiguracionPTFC {
    constructor() {
        // ✅ CONFIGURACIÓN DE COLORES
        this.colores = {
            // Colores del puente mágico
            puente: '#8B4513',           // Marrón para el puente
            vigas: '#654321',            // Marrón oscuro para vigas
            areaAcumulada: 'rgba(255, 215, 0, 0.3)', // Dorado transparente
            hada: '#FFD700',             // Dorado para el hada
            alas: '#FFFFFF',             // Blanco para las alas
            
            // Colores de la gráfica cartesiana
            funcion: '#8B5CF6',         // Morado para la función
            areaBajoCurva: 'rgba(59, 130, 246, 0.3)', // Azul transparente
            lineaIndicadora: '#EC4899',  // Rosa para línea indicadora
            puntoFuncion: '#8B5CF6',     // Morado para el punto
            grid: '#E5E7EB',            // Gris claro para grid
            ejes: '#6B7280',            // Gris para ejes
            
            // Colores de verificación
            verificacionExitosa: '#10B981', // Verde
            verificacionError: '#EF4444',   // Rojo
            advertencia: '#F59E0B'          // Amarillo
        }
        
        // ✅ CONFIGURACIÓN DE ANIMACIÓN
        this.animacion = {
            fps: 30,
            velocidadPorDefecto: 1,
            velocidadMinima: 0.1,
            velocidadMaxima: 5,
            duracionPorDefecto: 3000, // 3 segundos
            suavizado: true
        }
        
        // ✅ CONFIGURACIÓN DE CÁLCULOS
        this.calculos = {
            precision: 1000,            // Número de pasos para integración
            toleranciaVerificacion: 0.001, // Tolerancia para verificar teorema
            decimales: 4,               // Decimales para mostrar
            metodoIntegracion: 'trapecio' // Método de integración
        }
        
        // ✅ CONFIGURACIÓN DE VISUALIZACIÓN
        this.visualizacion = {
            // Puente mágico
            puente: {
                ancho: 800,
                alto: 400,
                margen: 40,
                alturaPuente: 50,
                separacionVigas: 0.3
            },
            
            // Gráfica cartesiana
            cartesiana: {
                ancho: 800,
                alto: 400,
                margen: 40,
                densidadPuntos: 200,
                grosorLinea: 3,
                radioPunto: 5
            },
            
            // Efectos visuales
            efectos: {
                brillo: true,
                particulas: true,
                transiciones: true,
                sombras: true
            }
        }
        
        // ✅ CONFIGURACIÓN DE FUNCIONES MATEMÁTICAS
        this.funciones = {
            cuadratica: {
                nombre: 'Cuadrática',
                formula: 'f(x) = 0.5x² - 2x + 3',
                dominio: { inicio: -2, fin: 6 },
                color: '#8B5CF6'
            },
            cubica: {
                nombre: 'Cúbica',
                formula: 'f(x) = 0.1x³ - 0.5x² + 2',
                dominio: { inicio: -3, fin: 5 },
                color: '#EC4899'
            },
            seno: {
                nombre: 'Seno',
                formula: 'f(x) = 2sin(x) + 3',
                dominio: { inicio: 0, fin: 2 * Math.PI },
                color: '#10B981'
            },
            exponencial: {
                nombre: 'Exponencial',
                formula: 'f(x) = e^(0.3x)',
                dominio: { inicio: -2, fin: 4 },
                color: '#F59E0B'
            },
            polinomio: {
                nombre: 'Polinómica',
                formula: 'f(x) = -0.1(x-2)³ + 2(x-2) + 4',
                dominio: { inicio: -1, fin: 5 },
                color: '#EF4444'
            }
        }
        
        // ✅ CONFIGURACIÓN DE LOGROS
        this.logros = {
            explorador: {
                id: 'explorador',
                nombre: '🧭 Explorador',
                descripcion: 'Primera exploración del puente',
                condicion: (datos) => datos.posicionX > datos.limiteA + 0.1
            },
            maestroTeorema: {
                id: 'maestro-teorema',
                nombre: '🎓 Maestro del Teorema',
                descripcion: 'Verificaste F\'(x) = f(x)',
                condicion: (datos) => datos.verificacionTeorema
            },
            animador: {
                id: 'animador',
                nombre: '🎬 Animador',
                descripcion: 'Completaste una animación',
                condicion: (datos) => datos.posicionX >= datos.limiteB - 0.1
            },
            exploradorFunciones: {
                id: 'explorador-funciones',
                nombre: '🔬 Explorador de Funciones',
                descripcion: 'Exploraste múltiples funciones',
                condicion: (datos) => datos.funcionesExploradas > 1
            }
        }
        
        // ✅ CONFIGURACIÓN DE INTERFAZ
        this.interfaz = {
            tema: 'claro',
            idioma: 'es',
            mostrarTooltips: true,
            mostrarValores: true,
            mostrarVerificacion: true,
            mostrarLogros: true
        }
    }
    
    // ✅ GETTERS PARA COLORES
    obtenerColores() {
        return this.colores
    }
    
    obtenerColor(categoria, elemento) {
        return this.colores[categoria]?.[elemento] || '#000000'
    }
    
    // ✅ GETTERS PARA ANIMACIÓN
    obtenerConfiguracionAnimacion() {
        return this.animacion
    }
    
    // ✅ GETTERS PARA CÁLCULOS
    obtenerConfiguracionCalculos() {
        return this.calculos
    }
    
    // ✅ GETTERS PARA VISUALIZACIÓN
    obtenerConfiguracionVisualizacion() {
        return this.visualizacion
    }
    
    // ✅ GETTERS PARA FUNCIONES
    obtenerFunciones() {
        return this.funciones
    }
    
    obtenerFuncion(nombre) {
        return this.funciones[nombre]
    }
    
    // ✅ GETTERS PARA LOGROS
    obtenerConfiguracionLogros() {
        return this.logros
    }
    
    // ✅ GETTERS PARA INTERFAZ
    obtenerConfiguracionInterfaz() {
        return this.interfaz
    }
    
    // ✅ ACTUALIZAR CONFIGURACIÓN
    actualizarConfiguracion(categoria, configuracion) {
        if (this[categoria]) {
            this[categoria] = { ...this[categoria], ...configuracion }
        }
    }
    
    // ✅ OBTENER CONFIGURACIÓN COMPLETA
    obtenerConfiguracionCompleta() {
        return {
            colores: this.colores,
            animacion: this.animacion,
            calculos: this.calculos,
            visualizacion: this.visualizacion,
            funciones: this.funciones,
            logros: this.logros,
            interfaz: this.interfaz
        }
    }
}
