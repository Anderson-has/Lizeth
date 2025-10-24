/**
 * RENDERIZADOR: RenderizadorCalculosLinealidad
 * RESPONSABILIDAD: Renderizar las tarjetas de cálculos de linealidad
 * SRP: Solo maneja presentación de cálculos, no lógica de negocio ni estado
 */
export class RenderizadorCalculosLinealidad {
  constructor(container) {
    this.container = container
  }

  // Renderizar todas las tarjetas de cálculos
  renderizar(estado, calculos) {
    this.limpiarContainer()
    this.renderizarTarjetaIntegralCombinada(estado, calculos)
    this.renderizarTarjetaCombinacionIntegrales(estado, calculos)
    this.renderizarTarjetaVerificacion(calculos)
  }

  // Limpiar container
  limpiarContainer() {
    this.container.innerHTML = ""
  }

  // Renderizar tarjeta de integral de la combinación
  renderizarTarjetaIntegralCombinada(estado, calculos) {
    const tarjeta = this.crearTarjeta("Integral de la Combinación Lineal", "brown")
    
    // Validar que los cálculos existan
    if (!calculos || typeof calculos.integralCombinada === 'undefined') {
      tarjeta.innerHTML = '<div class="text-red-600">Error: Cálculos no disponibles</div>'
      this.container.appendChild(tarjeta)
      return
    }
    
    const integralCombinada = calculos.integralCombinada || 0
    
    const contenido = `
      <div class="mb-2">
        <strong>∫[${estado.limiteA}, ${estado.limiteB}] [${estado.alpha}f(x) + ${estado.beta}g(x)] dx</strong>
      </div>
      <div class="mb-2">
        <strong>∫[${estado.limiteA}, ${estado.limiteB}] [${estado.alpha}${estado.fFuncion} + ${estado.beta}${estado.gFuncion}] dx</strong>
      </div>
      <div class="text-2xl font-bold text-blue-600">
        ${integralCombinada.toFixed(3)}
      </div>
    `
    
    tarjeta.innerHTML = contenido
    this.container.appendChild(tarjeta)
  }

  // Renderizar tarjeta de combinación de integrales
  renderizarTarjetaCombinacionIntegrales(estado, calculos) {
    const tarjeta = this.crearTarjeta("Combinación Lineal de las Integrales", "brown")
    
    // Validar que los cálculos existan
    if (!calculos || typeof calculos.integralF === 'undefined' || typeof calculos.integralG === 'undefined') {
      tarjeta.innerHTML = '<div class="text-red-600">Error: Cálculos no disponibles</div>'
      this.container.appendChild(tarjeta)
      return
    }
    
    const integralF = calculos.integralF || 0
    const integralG = calculos.integralG || 0
    const alphaFIntegral = calculos.alphaFIntegral || 0
    const betaGIntegral = calculos.betaGIntegral || 0
    
    const contenido = `
      <div class="mb-2">
        <strong>${estado.alpha}∫[${estado.limiteA}, ${estado.limiteB}] f(x) dx + ${estado.beta}∫[${estado.limiteA}, ${estado.limiteB}] g(x) dx</strong>
      </div>
      <div class="mb-2">
        <strong>${estado.alpha} × ${integralF.toFixed(3)} + ${estado.beta} × ${integralG.toFixed(3)}</strong>
      </div>
      <div class="text-2xl font-bold text-green-600">
        ${alphaFIntegral.toFixed(3)} + ${betaGIntegral.toFixed(3)} = ${(alphaFIntegral + betaGIntegral).toFixed(3)}
      </div>
    `
    
    tarjeta.innerHTML = contenido
    this.container.appendChild(tarjeta)
  }

  // Renderizar tarjeta de verificación
  renderizarTarjetaVerificacion(calculos) {
    // Validar que los cálculos y verificación existan
    if (!calculos || !calculos.verificacion) {
      const tarjeta = this.crearTarjeta("Verificación", "red")
      tarjeta.innerHTML = '<div class="text-red-600">Error: Verificación no disponible</div>'
      this.container.appendChild(tarjeta)
      return
    }
    
    const esValida = calculos.verificacion.esValida || false
    const tarjeta = this.crearTarjeta("Verificación Exitosa", esValida ? "green" : "red")
    
    const icono = esValida ? "✓" : "✗"
    const color = esValida ? "text-green-600" : "text-red-600"
    const ladoIzquierdo = calculos.verificacion.ladoIzquierdo || 0
    const ladoDerecho = calculos.verificacion.ladoDerecho || 0
    
    const contenido = `
      <div class="flex items-center justify-center mb-4">
        <div class="text-4xl ${color}">${icono}</div>
      </div>
      <div class="mb-2">
        <strong>Lado izquierdo: ${ladoIzquierdo.toFixed(3)}</strong>
      </div>
      <div class="mb-2">
        <strong>Lado derecho: ${ladoDerecho.toFixed(3)}</strong>
      </div>
      <div class="text-sm ${color}">
        ${esValida 
          ? "La propiedad de linealidad se cumple, ambos lados son iguales" 
          : "La propiedad NO se cumple, hay diferencia entre los lados"
        }
      </div>
    `
    
    tarjeta.innerHTML = contenido
    this.container.appendChild(tarjeta)
  }

  // Crear tarjeta base
  crearTarjeta(titulo, color) {
    const tarjeta = document.createElement('div')
    tarjeta.className = `bg-white rounded-lg shadow-md p-4 border-l-4 border-${color}-500`
    
    const header = document.createElement('div')
    header.className = 'flex items-center mb-3'
    
    const icono = document.createElement('div')
    icono.className = `w-6 h-6 bg-${color}-500 rounded mr-2`
    
    const tituloElement = document.createElement('h3')
    tituloElement.className = 'text-lg font-semibold text-gray-800'
    tituloElement.textContent = titulo
    
    header.appendChild(icono)
    header.appendChild(tituloElement)
    tarjeta.appendChild(header)
    
    return tarjeta
  }

  // Renderizar mensaje de error
  renderizarError(mensaje) {
    this.limpiarContainer()
    
    const errorDiv = document.createElement('div')
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <div class="text-red-500 mr-2">⚠</div>
        <div>
          <strong>Error:</strong> ${mensaje}
        </div>
      </div>
    `
    
    this.container.appendChild(errorDiv)
  }

  // Renderizar estado de carga
  renderizarCargando() {
    this.limpiarContainer()
    
    const loadingDiv = document.createElement('div')
    loadingDiv.className = 'flex items-center justify-center p-8'
    loadingDiv.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600">Calculando...</span>
    `
    
    this.container.appendChild(loadingDiv)
  }
}
