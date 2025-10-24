/**
 * RenderizadorCalculosAditividad - Renderizador que muestra los cálculos de aditividad
 * RESPONSABILIDAD ÚNICA: Solo renderizado de cálculos
 */
export class RenderizadorCalculosAditividad {
    constructor(configuracion) {
        this.configuracion = configuracion
    }
    
    // Renderizar todas las tarjetas de cálculo
    renderizar(container, calculos, verificacion, estadoValidacion, funcion, limites) {
        container.innerHTML = ''
        
        if (!estadoValidacion.valida) {
            this.renderizarError(container, estadoValidacion.mensaje)
            return
        }
        
        // Tarjeta 1: Integral completa [a,c]
        this.renderizarTarjetaIntegralCompleta(container, calculos, funcion, limites)
        
        // Tarjeta 2: Suma de subintervalos
        this.renderizarTarjetaSumaSubintervalos(container, calculos, funcion, limites)
        
        // Tarjeta 3: Verificación
        this.renderizarTarjetaVerificacion(container, calculos, verificacion)
    }
    
    // Renderizar error de validación
    renderizarError(container, mensaje) {
        const errorCard = document.createElement('div')
        errorCard.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4'
        errorCard.innerHTML = `
            <div class="flex items-center">
                <div class="text-red-500 mr-3">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-red-800">Error de Validación</h3>
                    <p class="text-sm text-red-700 mt-1">${mensaje}</p>
                </div>
            </div>
        `
        container.appendChild(errorCard)
    }
    
    // Tarjeta 1: Integral completa [a,c]
    renderizarTarjetaIntegralCompleta(container, calculos, funcion, limites) {
        const card = document.createElement('div')
        card.className = 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4'
        
        const valorIntegralAC = calculos.integralAC ? calculos.integralAC.toFixed(3) : '0.000'
        
        card.innerHTML = `
            <div class="flex items-center mb-3">
                <div class="text-purple-500 mr-3">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-purple-800">Integral sobre [${limites.a}, ${limites.c}]</h3>
            </div>
            <div class="space-y-2">
                <div class="text-sm text-gray-700">
                    <span class="font-mono">∫[${limites.a}, ${limites.c}] ${funcion} dx</span>
                </div>
                <div class="text-sm text-gray-600">
                    <span class="font-mono">∫[${limites.a}, ${limites.c}] {${funcion}} dx</span>
                </div>
                <div class="text-lg font-bold text-purple-700">
                    = <span class="font-mono">${valorIntegralAC}</span>
                </div>
            </div>
        `
        container.appendChild(card)
    }
    
    // Tarjeta 2: Suma de subintervalos
    renderizarTarjetaSumaSubintervalos(container, calculos, funcion, limites) {
        const card = document.createElement('div')
        card.className = 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4'
        
        const valorIntegralAB = calculos.integralAB ? calculos.integralAB.toFixed(3) : '0.000'
        const valorIntegralBC = calculos.integralBC ? calculos.integralBC.toFixed(3) : '0.000'
        const valorSuma = calculos.sumaAB_BC ? calculos.sumaAB_BC.toFixed(3) : '0.000'
        
        card.innerHTML = `
            <div class="flex items-center mb-3">
                <div class="text-blue-500 mr-3">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-blue-800">Suma de Integrales sobre Subintervalos</h3>
            </div>
            <div class="space-y-3">
                <div class="text-sm text-gray-700">
                    <span class="font-mono">∫[${limites.a}, ${limites.b}] ${funcion} dx + ∫[${limites.b}, ${limites.c}] ${funcion} dx</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-blue-100 p-3 rounded">
                        <div class="text-xs text-blue-600 font-medium">∫[${limites.a}, ${limites.b}]</div>
                        <div class="text-sm font-mono text-blue-800">${valorIntegralAB}</div>
                    </div>
                    <div class="bg-green-100 p-3 rounded">
                        <div class="text-xs text-green-600 font-medium">∫[${limites.b}, ${limites.c}]</div>
                        <div class="text-sm font-mono text-green-800">${valorIntegralBC}</div>
                    </div>
                </div>
                <div class="text-lg font-bold text-blue-700">
                    = <span class="font-mono">${valorIntegralAB} + ${valorIntegralBC} = ${valorSuma}</span>
                </div>
            </div>
        `
        container.appendChild(card)
    }
    
    // Tarjeta 3: Verificación
    renderizarTarjetaVerificacion(container, calculos, verificacion) {
        const card = document.createElement('div')
        const esExitosa = verificacion.exitosa
        const colorFondo = esExitosa ? 'from-green-50 to-emerald-50' : 'from-red-50 to-pink-50'
        const colorBorde = esExitosa ? 'border-green-200' : 'border-red-200'
        const colorTexto = esExitosa ? 'text-green-800' : 'text-red-800'
        const icono = esExitosa ? '✅' : '❌'
        const mensaje = esExitosa ? 'Verificación Exitosa' : 'Error en la Verificación'
        
        card.className = `bg-gradient-to-r ${colorFondo} border ${colorBorde} rounded-lg p-4 mb-4`
        
        const valorIntegralAC = calculos.integralAC ? calculos.integralAC.toFixed(3) : '0.000'
        const valorSuma = calculos.sumaAB_BC ? calculos.sumaAB_BC.toFixed(3) : '0.000'
        const diferencia = Math.abs(calculos.integralAC - calculos.sumaAB_BC).toFixed(6)
        
        card.innerHTML = `
            <div class="flex items-center mb-3">
                <div class="text-2xl mr-3">${icono}</div>
                <h3 class="text-lg font-semibold ${colorTexto}">${mensaje}</h3>
            </div>
            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-sm">
                        <div class="font-medium text-gray-600">Integral completa [a,c]:</div>
                        <div class="font-mono text-gray-800">${valorIntegralAC}</div>
                    </div>
                    <div class="text-sm">
                        <div class="font-medium text-gray-600">Suma de subintervalos:</div>
                        <div class="font-mono text-gray-800">${valorSuma}</div>
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    <span class="font-medium">Diferencia:</span> <span class="font-mono">${diferencia}</span>
                </div>
                <div class="text-sm ${colorTexto} font-medium">
                    ${esExitosa ? 'La propiedad de aditividad se cumple' : 'Los valores no coinciden'}
                </div>
            </div>
        `
        container.appendChild(card)
    }
}

