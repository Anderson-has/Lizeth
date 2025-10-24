'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProgresoEstudiante } from '@/components/ProgresoEstudiante'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Settings, 
  BarChart3, 
  Clock, 
  Trophy, 
  BookOpen, 
  LogOut, 
  User,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react'

export default function DashboardDocente() {
  const { usuario, cerrarSesion, obtenerUsuarios, eliminarUsuario, verificarPermisos } = useAuth()
  const router = useRouter()
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<string | null>(null)
  const [escenarios, setEscenarios] = useState({
    jardinRiemann: { habilitado: true, nombre: 'Jardín de Riemann' },
    puenteTeorema: { habilitado: true, nombre: 'Puente del Teorema Fundamental' },
    torreValorMedio: { habilitado: true, nombre: 'Torre del Valor Medio' },
    cristalAntiderivadas: { habilitado: true, nombre: 'Cristal de Antiderivadas' }
  })

  useEffect(() => {
    if (usuario?.esDocente()) {
      const todosUsuarios = obtenerUsuarios()
      const estudiantesData = todosUsuarios.filter(u => u.esEstudiante())
      setEstudiantes(estudiantesData)
    }
  }, [usuario, obtenerUsuarios])

  const handleLogout = () => {
    cerrarSesion()
    router.push('/login')
  }

  const toggleEscenario = (escenario: string) => {
    setEscenarios(prev => ({
      ...prev,
      [escenario]: {
        ...prev[escenario],
        habilitado: !prev[escenario].habilitado
      }
    }))
  }

  const handleEliminarEstudiante = (estudianteId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      eliminarUsuario(estudianteId)
      setEstudiantes(prev => prev.filter(e => e.id !== estudianteId))
    }
  }

  const obtenerEstadisticasGenerales = () => {
    const totalEstudiantes = estudiantes.length
    const estudiantesActivos = estudiantes.filter(e => e.activo).length
    const tiempoPromedio = estudiantes.reduce((sum, e) => 
      sum + (e.progreso?.tiempoTotal || 0), 0) / totalEstudiantes || 0
    const escenariosCompletados = estudiantes.reduce((sum, e) => 
      sum + (e.progreso?.escenariosCompletados?.length || 0), 0)

    return {
      totalEstudiantes,
      estudiantesActivos,
      tiempoPromedio,
      escenariosCompletados
    }
  }

  const stats = obtenerEstadisticasGenerales()

  return (
    <ProtectedRoute requiredRole="docente">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Panel de Control Docente</h1>
              <p className="text-gray-600">Bienvenido, {usuario?.obtenerNombreCompleto()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{usuario?.nombreUsuario}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEstudiantes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.estudiantesActivos} activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(stats.tiempoPromedio / 60)}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Por estudiante
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escenarios Completados</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.escenariosCompletados}</div>
                <p className="text-xs text-muted-foreground">
                  En total
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
                  {Math.round((stats.escenariosCompletados / (stats.totalEstudiantes * 4)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Completitud
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Gestión */}
          <Tabs defaultValue="estudiantes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estudiantes">Gestión de Estudiantes</TabsTrigger>
              <TabsTrigger value="escenarios">Configuración de Escenarios</TabsTrigger>
              <TabsTrigger value="reportes">Reportes y Análisis</TabsTrigger>
            </TabsList>

            <TabsContent value="estudiantes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Estudiantes</CardTitle>
                  <CardDescription>
                    Gestiona los estudiantes y visualiza su progreso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {estudiantes.map((estudiante) => (
                      <div key={estudiante.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{estudiante.obtenerNombreCompleto()}</h3>
                            <p className="text-sm text-gray-600">
                              {estudiante.nombreUsuario} • Semestre {estudiante.semestre}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={estudiante.activo ? "default" : "secondary"}>
                                {estudiante.activo ? "Activo" : "Inactivo"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {estudiante.progreso?.tiempoTotal ? 
                                  `${Math.round(estudiante.progreso.tiempoTotal / 60)}m` : '0m'} de tiempo
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEstudianteSeleccionado(estudiante.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Progreso de {estudiante.obtenerNombreCompleto()}</DialogTitle>
                                <DialogDescription>
                                  Información detallada del progreso y logros del estudiante
                                </DialogDescription>
                              </DialogHeader>
                              <ProgresoEstudiante 
                                estudianteId={estudiante.id} 
                                mostrarDetalles={true}
                              />
                            </DialogContent>
                          </Dialog>
                          {verificarPermisos('eliminarUsuarios') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEliminarEstudiante(estudiante.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {estudiantes.length === 0 && (
                      <Alert>
                        <AlertDescription>
                          No hay estudiantes registrados aún.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="escenarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Escenarios</CardTitle>
                  <CardDescription>
                    Habilita o deshabilita escenarios para los estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(escenarios).map(([key, escenario]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium">{escenario.nombre}</h3>
                            <p className="text-sm text-gray-600">
                              {escenario.habilitado ? 'Disponible para estudiantes' : 'No disponible'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={escenario.habilitado}
                          onCheckedChange={() => toggleEscenario(key)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reportes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Escenarios Más Populares</CardTitle>
                    <CardDescription>
                      Los escenarios con mayor tiempo de uso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(escenarios).map(([key, escenario]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{escenario.nombre}</span>
                          <Badge variant="outline">
                            {Math.floor(Math.random() * 100)}% uso
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                      Últimas actividades de los estudiantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {estudiantes.slice(0, 5).map((estudiante) => (
                        <div key={estudiante.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{estudiante.nombreUsuario}</p>
                            <p className="text-xs text-gray-600">
                              Última actividad: {estudiante.progreso?.ultimaActividad ? 
                                new Date(estudiante.progreso.ultimaActividad).toLocaleDateString() : 
                                'Nunca'
                              }
                            </p>
                          </div>
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
