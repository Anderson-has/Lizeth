/**
 * RenderizadorCalculosInversionLimites - Renderizador que muestra los cálculos de inversión de límites
 * RESPONSABILIDAD ÚNICA: Solo mostrar información de cálculos
 */
export class RenderizadorCalculosInversionLimites {
    constructor(configuracion) {
        this.configuracion = configuracion
    }
    
    // Renderizar cálculos en el contenedor
    renderizar(container, calculos, verificacion) {
        if (!container || !calculos || !verificacion) return
        
        // Obtener límites del estado o usar valores por defecto
        const limites = calculos.limites || { a: 0, b: 2 }
        const areaNormal = calculos.areaNormal || 0
        const areaInvertida = calculos.areaInvertida || 0
        const diferencia = calculos.diferencia || 0
        
        container.innerHTML = `
            <div class="calculos-inversion-limites">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">
                    Propiedad de Inversión de Límites
                </h3>
                
                <div class="space-y-3">
                    <!-- Fórmula -->
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-blue-800 mb-1">Fórmula:</p>
                        <p class="text-lg font-mono text-blue-900">
                            ∫[${limites.a}→${limites.b}] f(x)dx = -∫[${limites.b}→${limites.a}] f(x)dx
                        </p>
                    </div>
                    
                    <!-- Cálculos -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-green-50 p-3 rounded-lg">
                            <p class="text-sm font-medium text-green-800 mb-1">Área Normal:</p>
                            <p class="text-lg font-mono text-green-900">
                                ∫[${limites.a}→${limites.b}] f(x)dx = ${areaNormal.toFixed(4)}
                            </p>
                        </div>
                        
                        <div class="bg-red-50 p-3 rounded-lg">
                            <p class="text-sm font-medium text-red-800 mb-1">Área Invertida:</p>
                            <p class="text-lg font-mono text-red-900">
                                ∫[${limites.b}→${limites.a}] f(x)dx = ${areaInvertida.toFixed(4)}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Verificación -->
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-gray-800 mb-1">Verificación:</p>
                        <p class="text-sm ${verificacion.esValida ? 'text-green-600' : 'text-red-600'}">
                            ${verificacion.mensaje}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">
                            Diferencia: ${diferencia.toFixed(6)}
                        </p>
                    </div>
                    
                    <!-- Explicación -->
                    <div class="bg-yellow-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-yellow-800 mb-1">Explicación:</p>
                        <p class="text-sm text-yellow-900">
                            Al intercambiar los límites de integración, el resultado cambia de signo. 
                            Esto es una propiedad fundamental de las integrales definidas.
                        </p>
                    </div>
                </div>
            </div>
        `
    }
    
    // Limpiar contenedor
    limpiar(container) {
        if (container) {
            container.innerHTML = ''
        }
    }
    
    // Mostrar mensaje de error
    mostrarError(container, mensaje) {
        if (!container) return
        
        container.innerHTML = `
            <div class="calculos-inversion-limites">
                <div class="bg-red-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-red-800 mb-2">Error</h3>
                    <p class="text-red-700">${mensaje}</p>
                </div>
            </div>
        `
    }
    
    // Mostrar mensaje de carga
    mostrarCarga(container) {
        if (!container) return
        
        container.innerHTML = `
            <div class="calculos-inversion-limites">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-blue-800 mb-2">Calculando...</h3>
                    <p class="text-blue-700">Generando cálculos de inversión de límites...</p>
                </div>
            </div>
        `
    }
}
