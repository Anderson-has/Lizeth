'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  BookOpen,
  Calendar,
  Star
} from 'lucide-react'

interface ProgresoEstudianteProps {
  estudianteId?: string
  mostrarDetalles?: boolean
}

export function ProgresoEstudiante({ estudianteId, mostrarDetalles = false }: ProgresoEstudianteProps) {
  const { usuario, obtenerUsuarios } = useAuth()
  const [progreso, setProgreso] = useState<any>(null)
  const [logros, setLogros] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarProgreso()
  }, [estudianteId])

  const cargarProgreso = async () => {
    try {
      setCargando(true)
      
      // Simular carga de datos del servicio de progreso
      const usuarios = obtenerUsuarios()
      const estudiante = estudianteId ? 
        usuarios.find(u => u.id === estudianteId) : 
        usuario

      if (estudiante && estudiante.esEstudiante()) {
        const estadisticas = estudiante.obtenerEstadisticas()
        const logrosObtenidos = estudiante.progreso?.logros || []
        
        setProgreso({
          estadisticas,
          historial: estudiante.historialActividad || [],
          escenariosHabilitados: estudiante.escenariosHabilitados || []
        })

        // Simular logros obtenidos
        setLogros([
          {
            id: 'primer_paso',
            nombre: 'Primer Paso',
            descripcion: 'Completa tu primera actividad',
            icono: '👶',
            raridad: 'comun',
            puntos: 5,
            fechaObtencion: new Date()
          },
          {
            id: 'explorador',
            nombre: 'Explorador',
            descripcion: 'Realiza 10 actividades diferentes',
            icono: '🔍',
            raridad: 'raro',
            puntos: 15,
            fechaObtencion: new Date()
          }
        ])
      }
    } catch (error) {
      console.error('Error cargando progreso:', error)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando progreso...</p>
        </div>
      </div>
    )
  }

  if (!progreso) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No se encontró información de progreso</p>
      </div>
    )
  }

  const formatearTiempo = (milisegundos: number) => {
    const minutos = Math.floor(milisegundos / 60000)
    const segundos = Math.floor((milisegundos % 60000) / 1000)
    return `${minutos}m ${segundos}s`
  }

  const obtenerColorRaridad = (raridad: string) => {
    const colores = {
      'comun': 'text-gray-500',
      'raro': 'text-blue-500',
      'epico': 'text-purple-500',
      'legendario': 'text-yellow-500'
    }
    return colores[raridad] || colores.comun
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Progreso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearTiempo(progreso.estadisticas.tiempoTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escenarios Completados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progreso.estadisticas.escenariosCompletados.length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {progreso.escenariosHabilitados.length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logros Obtenidos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progreso.estadisticas.logrosObtenidos}
            </div>
            <p className="text-xs text-muted-foreground">
              {logros.length} logros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(progreso.estadisticas.progresoGeneral)}%
            </div>
            <Progress 
              value={progreso.estadisticas.progresoGeneral} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {mostrarDetalles && (
        <Tabs defaultValue="progreso" className="space-y-4">
          <TabsList>
            <TabsTrigger value="progreso">Progreso por Escenario</TabsTrigger>
            <TabsTrigger value="logros">Logros</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="progreso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progreso por Escenario</CardTitle>
                <CardDescription>
                  Detalle del progreso en cada escenario disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progreso.escenariosHabilitados.map((escenario: string) => {
                    const actividades = progreso.historial.filter((a: any) => a.escenario === escenario)
                    const tiempoTotal = actividades.reduce((sum: number, a: any) => sum + a.tiempo, 0)
                    const completado = progreso.estadisticas.escenariosCompletados.includes(escenario)
                    
                    return (
                      <div key={escenario} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium capitalize">
                              {escenario.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatearTiempo(tiempoTotal)} • {actividades.length} actividades
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {completado && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                          <div className="w-24">
                            <Progress 
                              value={completado ? 100 : Math.min((actividades.length / 5) * 100, 100)} 
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logros" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logros Obtenidos</CardTitle>
                <CardDescription>
                  Certificaciones y logros desbloqueados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logros.map((logro) => (
                    <div key={logro.id} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{logro.icono}</span>
                        <div>
                          <h3 className="font-medium">{logro.nombre}</h3>
                          <p className="text-sm text-gray-600">{logro.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={obtenerColorRaridad(logro.raridad)}
                        >
                          {logro.raridad}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{logro.puntos}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Actividad</CardTitle>
                <CardDescription>
                  Registro detallado de todas las actividades realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progreso.historial.slice(0, 10).map((actividad: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium capitalize">
                            {actividad.escenario.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {actividad.fecha ? new Date(actividad.fecha).toLocaleString() : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatearTiempo(actividad.tiempo)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {actividad.accion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
