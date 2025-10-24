/**
 * PRESENTACIÓN: RenderizadorCalculosComparacion
 * RESPONSABILIDAD: Solo renderizar los cálculos de comparación
 * SRP: Solo renderizado de cálculos, no cálculos ni estado
 */
export class RenderizadorCalculosComparacion {
    constructor(configuracion) {
        this.configuracion = configuracion
    }

    // Renderizar cálculos en el contenedor
    renderizar(container, calculos, verificacion) {
        if (!container || !calculos || !verificacion) return

        // Obtener límites del estado o usar valores por defecto
        const limites = calculos.limites || { a: 0, b: 1 }
        const integralF = calculos.integralF || 0
        const integralG = calculos.integralG || 0
        const diferencia = calculos.diferencia || 0

        container.innerHTML = `
            <div class="calculos-comparacion">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">
                    Propiedad de Comparación
                </h3>
                <div class="space-y-3">
                    <!-- Fórmula -->
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-blue-800 mb-1">Fórmula:</p>
                        <p class="text-lg font-mono text-blue-900">
                            Si f(x) ≤ g(x) en [a,b], entonces ∫[a→b] f(x)dx ≤ ∫[a→b] g(x)dx
                        </p>
                    </div>
                    
                    <!-- Cálculos -->
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm text-gray-700">
                            ∫[${limites.a}→${limites.b}] f(x)dx: 
                            <span class="font-bold text-blue-700">${integralF.toFixed(4)}</span>
                        </p>
                        <p class="text-sm text-gray-700">
                            ∫[${limites.a}→${limites.b}] g(x)dx: 
                            <span class="font-bold text-red-700">${integralG.toFixed(4)}</span>
                        </p>
                        <p class="text-sm text-gray-700">
                            Diferencia: 
                            <span class="font-bold">${diferencia.toFixed(6)}</span>
                        </p>
                    </div>
                    
                    <!-- Comparación -->
                    <div class="bg-green-50 p-3 rounded-lg">
                        <p class="text-sm font-semibold text-green-700 mb-2">
                            Comparación: ${integralF.toFixed(4)} ${integralF >= integralG ? '≥' : '<'} ${integralG.toFixed(4)}
                        </p>
                        <p class="text-xs text-gray-600">
                            ${integralF >= integralG ? 
                                'f(x) tiene mayor área bajo la curva' : 
                                'g(x) tiene mayor área bajo la curva'
                            }
                        </p>
                    </div>
                    
                    <!-- Verificación -->
                    <div class="p-3 rounded-lg ${verificacion.esValida ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}">
                        <p class="text-sm font-semibold ${verificacion.esValida ? 'text-green-700' : 'text-orange-700'}">
                            Verificación: ${verificacion.mensaje}
                        </p>
                    </div>
                </div>
            </div>
        `
    }

    limpiar(container) {
        if (container) {
            container.innerHTML = ''
        }
    }
}
