/**
 * ENTIDAD: TeoriaSegundoTeorema
 * RESPONSABILIDAD: Almacenar y gestionar contenido teórico del Segundo Teorema Fundamental del Cálculo
 * SRP: Solo maneja datos de teoría, no realiza cálculos ni renderizado
 */
export class TeoriaSegundoTeorema {
    constructor() {
        this.titulo = 'Segundo Teorema Fundamental del Cálculo'
        this.descripcion = 'Establece la conexión entre las integrales definidas y las antiderivadas'
        this.formula = '∫[a,b] f(x)dx = F(b) - F(a)'
        this.condicion = 'Donde F\'(x) = f(x)'
        
        this.secciones = {
            introduccion: {
                titulo: 'Introducción',
                contenido: `
                    <h3>¿Qué es el Segundo Teorema Fundamental?</h3>
                    <p>El Segundo Teorema Fundamental del Cálculo es uno de los teoremas más importantes del cálculo. Establece una conexión directa entre las <strong>integrales definidas</strong> y las <strong>antiderivadas</strong>.</p>
                    
                    <div class="highlight-box">
                        <h4>Fórmula Principal:</h4>
                        <div class="formula">∫[a,b] f(x)dx = F(b) - F(a)</div>
                        <p>Donde F(x) es una antiderivada de f(x), es decir, F'(x) = f(x)</p>
                    </div>
                    
                    <p>Este teorema nos permite calcular integrales definidas de manera mucho más sencilla, sin necesidad de usar límites de sumas de Riemann.</p>
                `
            },
            
            concepto: {
                titulo: 'Concepto Clave',
                contenido: `
                    <h3>La Conexión Derivada-Integral</h3>
                    <p>El Segundo Teorema Fundamental se basa en una idea fundamental:</p>
                    
                    <div class="concept-box">
                        <h4>💡 Idea Clave:</h4>
                        <p>Si F(x) es una antiderivada de f(x), entonces:</p>
                        <ul>
                            <li>F'(x) = f(x) (la derivada de F es f)</li>
                            <li>∫ f(x)dx = F(x) + C (la integral de f es F más una constante)</li>
                        </ul>
                    </div>
                    
                    <p>Esto significa que las operaciones de <strong>derivación</strong> e <strong>integración</strong> son inversas entre sí.</p>
                `
            },
            
            proceso: {
                titulo: 'Proceso Paso a Paso',
                contenido: `
                    <h3>¿Cómo usar el Segundo Teorema?</h3>
                    <p>Para calcular ∫[a,b] f(x)dx usando el Segundo Teorema, sigue estos pasos:</p>
                    
                    <div class="steps-container">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Identifica la función f(x)</h4>
                                <p>Ten claro cuál es la función que quieres integrar.</p>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Encuentra una antiderivada F(x)</h4>
                                <p>Busca una función F(x) tal que F'(x) = f(x).</p>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Evalúa F(x) en los límites</h4>
                                <p>Calcula F(a) y F(b).</p>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Calcula F(b) - F(a)</h4>
                                <p>Esta diferencia es el valor de la integral definida.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            
            ejemplos: {
                titulo: 'Ejemplos Ilustrativos',
                contenido: `
                    <h3>Ejemplos Comunes</h3>
                    
                    <div class="example">
                        <h4>Ejemplo 1: ∫[0,π] sin(x) dx</h4>
                        <div class="solution">
                            <p><strong>Paso 1:</strong> f(x) = sin(x)</p>
                            <p><strong>Paso 2:</strong> F(x) = -cos(x) (porque (-cos(x))' = sin(x))</p>
                            <p><strong>Paso 3:</strong> F(0) = -cos(0) = -1, F(π) = -cos(π) = 1</p>
                            <p><strong>Paso 4:</strong> ∫[0,π] sin(x) dx = F(π) - F(0) = 1 - (-1) = 2</p>
                        </div>
                    </div>
                    
                    <div class="example">
                        <h4>Ejemplo 2: ∫[0,1] e^x dx</h4>
                        <div class="solution">
                            <p><strong>Paso 1:</strong> f(x) = e^x</p>
                            <p><strong>Paso 2:</strong> F(x) = e^x (porque (e^x)' = e^x)</p>
                            <p><strong>Paso 3:</strong> F(0) = e^0 = 1, F(1) = e^1 = e</p>
                            <p><strong>Paso 4:</strong> ∫[0,1] e^x dx = F(1) - F(0) = e - 1</p>
                        </div>
                    </div>
                `
            },
            
            importancia: {
                titulo: 'Importancia del Teorema',
                contenido: `
                    <h3>¿Por qué es tan importante?</h3>
                    
                    <div class="importance-grid">
                        <div class="importance-item">
                            <h4>🎯 Simplificación</h4>
                            <p>Nos permite calcular integrales definidas sin usar límites complicados.</p>
                        </div>
                        
                        <div class="importance-item">
                            <h4>🔗 Conexión</h4>
                            <p>Establece la relación fundamental entre derivadas e integrales.</p>
                        </div>
                        
                        <div class="importance-item">
                            <h4>⚡ Eficiencia</h4>
                            <p>Hace que el cálculo de integrales sea mucho más rápido y directo.</p>
                        </div>
                        
                        <div class="importance-item">
                            <h4>🧮 Aplicaciones</h4>
                            <p>Es la base para muchas aplicaciones en física, ingeniería y matemáticas.</p>
                        </div>
                    </div>
                `
            },
            
            condiciones: {
                titulo: 'Condiciones del Teorema',
                contenido: `
                    <h3>¿Cuándo se puede aplicar?</h3>
                    
                    <div class="conditions-box">
                        <h4>Condiciones necesarias:</h4>
                        <ul>
                            <li><strong>f(x) debe ser continua</strong> en el intervalo [a,b]</li>
                            <li><strong>F(x) debe ser una antiderivada</strong> de f(x) en [a,b]</li>
                            <li><strong>F'(x) = f(x)</strong> para todo x en [a,b]</li>
                        </ul>
                    </div>
                    
                    <div class="warning-box">
                        <h4>⚠️ Importante:</h4>
                        <p>Si f(x) no es continua en [a,b], el teorema puede no aplicarse directamente. En esos casos, se necesitan técnicas especiales.</p>
                    </div>
                `
            },
            
            aplicaciones: {
                titulo: 'Aplicaciones Prácticas',
                contenido: `
                    <h3>¿Dónde se usa este teorema?</h3>
                    
                    <div class="applications-list">
                        <div class="application">
                            <h4>📐 Geometría</h4>
                            <p>Cálculo de áreas bajo curvas, volúmenes de revolución.</p>
                        </div>
                        
                        <div class="application">
                            <h4>⚡ Física</h4>
                            <p>Cálculo de trabajo, energía, movimiento, campos electromagnéticos.</p>
                        </div>
                        
                        <div class="application">
                            <h4>🏗️ Ingeniería</h4>
                            <p>Análisis de señales, control de sistemas, optimización.</p>
                        </div>
                        
                        <div class="application">
                            <h4>📊 Estadística</h4>
                            <p>Cálculo de probabilidades, distribuciones continuas.</p>
                        </div>
                    </div>
                `
            }
        }
        
        this.estilos = `
            <style>
                .highlight-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: center;
                }
                
                .formula {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 10px 0;
                    font-family: 'Courier New', monospace;
                }
                
                .concept-box {
                    background: #f0f9ff;
                    border-left: 4px solid #0ea5e9;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                
                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin: 20px 0;
                }
                
                .step {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                }
                
                .step-number {
                    background: #3b82f6;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    flex-shrink: 0;
                }
                
                .step-content h4 {
                    margin: 0 0 5px 0;
                    color: #1e293b;
                }
                
                .example {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                }
                
                .solution {
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                }
                
                .importance-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                
                .importance-item {
                    background: #ecfdf5;
                    border: 1px solid #10b981;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                }
                
                .importance-item h4 {
                    margin: 0 0 10px 0;
                    color: #065f46;
                }
                
                .conditions-box {
                    background: #fef2f2;
                    border: 1px solid #f87171;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                }
                
                .warning-box {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                }
                
                .applications-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .application {
                    background: #f0f9ff;
                    border: 1px solid #0ea5e9;
                    border-radius: 8px;
                    padding: 15px;
                }
                
                .application h4 {
                    margin: 0 0 10px 0;
                    color: #0c4a6e;
                }
            </style>
        `
    }

    // ✅ OBTENER INFORMACIÓN COMPLETA
    obtenerInformacionCompleta() {
        return {
            titulo: this.titulo,
            descripcion: this.descripcion,
            formula: this.formula,
            condicion: this.condicion,
            secciones: this.secciones,
            estilos: this.estilos
        }
    }

    // ✅ OBTENER SECCIÓN ESPECÍFICA
    obtenerSeccion(nombreSeccion) {
        return this.secciones[nombreSeccion] || null
    }

    // ✅ OBTENER TODAS LAS SECCIONES
    obtenerTodasLasSecciones() {
        return this.secciones
    }

    // ✅ OBTENER CONTENIDO HTML COMPLETO
    obtenerContenidoHTML() {
        let html = this.estilos
        html += `<div class="teoria-container">`
        html += `<h1>${this.titulo}</h1>`
        html += `<p class="descripcion">${this.descripcion}</p>`
        
        Object.values(this.secciones).forEach(seccion => {
            html += `<div class="seccion">`
            html += `<h2>${seccion.titulo}</h2>`
            html += seccion.contenido
            html += `</div>`
        })
        
        html += `</div>`
        return html
    }

    // ✅ OBTENER RESUMEN
    obtenerResumen() {
        return {
            titulo: this.titulo,
            descripcion: this.descripcion,
            formula: this.formula,
            numeroSecciones: Object.keys(this.secciones).length,
            secciones: Object.keys(this.secciones)
        }
    }
}

