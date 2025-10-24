'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Crown, Sparkles, User, Lock, Mail, Eye, EyeOff, GraduationCap, BookOpen, Users, Settings } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { iniciarSesion, registrarUsuario, cargando } = useAuth()
  
  // Estados para login
  const [loginData, setLoginData] = useState({
    correo: '',
    contrasena: ''
  })
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')

  // Estados para registro
  const [registroData, setRegistroData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    tipoUsuario: 'estudiante',
    semestre: ''
  })
  const [mostrarContrasenaRegistro, setMostrarContrasenaRegistro] = useState(false)
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false)
  const [errorRegistro, setErrorRegistro] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorLogin('')
    
    try {
      await iniciarSesion(loginData.correo, loginData.contrasena)
      router.push('/')
    } catch (error: any) {
      setErrorLogin(error.message)
    }
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorRegistro('')

    // Validaciones básicas
    if (registroData.contrasena !== registroData.confirmarContrasena) {
      setErrorRegistro('Las contraseñas no coinciden')
      return
    }

    if (registroData.tipoUsuario === 'estudiante' && !registroData.semestre) {
      setErrorRegistro('El semestre es requerido para estudiantes')
      return
    }

    try {
      const datosUsuario = {
        ...registroData,
        semestre: registroData.tipoUsuario === 'estudiante' ? parseInt(registroData.semestre) : undefined
      }
      
      await registrarUsuario(datosUsuario)
      setModalAbierto(false)
      setErrorRegistro('')
      // Limpiar formulario
      setRegistroData({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        nombreUsuario: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        tipoUsuario: 'estudiante',
        semestre: ''
      })
    } catch (error: any) {
      setErrorRegistro(error.message)
    }
  }

  const cuentasDemo = [
    {
      tipo: 'Estudiante Demo',
      correo: 'maria@universidad.edu.co',
      contrasena: 'estudiante123',
      descripcion: 'Acceso completo a simulaciones',
      icono: BookOpen,
      color: 'text-green-600'
    },
    {
      tipo: 'Prof. Sergio Demo',
      correo: 'sergio@universidad.edu.co',
      contrasena: 'docente123',
      descripcion: 'Panel de control docente',
      icono: Settings,
      color: 'text-blue-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-purple-800">IntegraLearn</h1>
            <Sparkles className="h-6 w-6 text-yellow-500 ml-2" />
          </div>
          <p className="text-gray-600">Reino Mágico de las Matemáticas</p>
        </div>

        {/* Formulario de Login */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta para continuar aprendiendo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="tu@universidad.edu.co"
                    value={loginData.correo}
                    onChange={(e) => setLoginData({ ...loginData, correo: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    placeholder="********"
                    value={loginData.contrasena}
                    onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {mostrarContrasena ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {errorLogin && (
                <Alert variant="destructive">
                  <AlertDescription>{errorLogin}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={cargando}>
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6">
              <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                    <User className="mr-2 h-4 w-4" />
                    Regístrate al Reino Mágico
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Crown className="h-6 w-6 text-purple-600 mr-2" />
                      Únete al Reino
                      <Sparkles className="h-5 w-5 text-yellow-500 ml-2" />
                    </DialogTitle>
                    <DialogDescription>Crea tu cuenta mágica</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleRegistro} className="space-y-4">
                    <Tabs defaultValue="estudiante" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="estudiante" className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Estudiante
                        </TabsTrigger>
                        <TabsTrigger value="docente" className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Docente
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="estudiante" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primerNombre">Primer Nombre *</Label>
                            <div className="relative">
                              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="primerNombre"
                                placeholder="Ej: María"
                                value={registroData.primerNombre}
                                onChange={(e) => setRegistroData({ ...registroData, primerNombre: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="segundoNombre">Segundo Nombre</Label>
                            <div className="relative">
                              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="segundoNombre"
                                placeholder="Ej: Elena"
                                value={registroData.segundoNombre}
                                onChange={(e) => setRegistroData({ ...registroData, segundoNombre: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primerApellido">Primer Apellido *</Label>
                            <div className="relative">
                              <Crown className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="primerApellido"
                                placeholder="Ej: García"
                                value={registroData.primerApellido}
                                onChange={(e) => setRegistroData({ ...registroData, primerApellido: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="segundoApellido"
                                placeholder="Ej: López"
                                value={registroData.segundoApellido}
                                onChange={(e) => setRegistroData({ ...registroData, segundoApellido: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="semestre">Semestre Actual *</Label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                            <Select
                              value={registroData.semestre}
                              onValueChange={(value) => setRegistroData({ ...registroData, semestre: value })}
                            >
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Selecciona tu semestre" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                                  <SelectItem key={sem} value={sem.toString()}>
                                    Semestre {sem}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="docente" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primerNombreDoc">Primer Nombre *</Label>
                            <div className="relative">
                              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="primerNombreDoc"
                                placeholder="Ej: Sergio"
                                value={registroData.primerNombre}
                                onChange={(e) => setRegistroData({ ...registroData, primerNombre: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="segundoNombreDoc">Segundo Nombre</Label>
                            <div className="relative">
                              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="segundoNombreDoc"
                                placeholder="Ej: Alejandro"
                                value={registroData.segundoNombre}
                                onChange={(e) => setRegistroData({ ...registroData, segundoNombre: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primerApellidoDoc">Primer Apellido *</Label>
                            <div className="relative">
                              <Crown className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="primerApellidoDoc"
                                placeholder="Ej: Rodríguez"
                                value={registroData.primerApellido}
                                onChange={(e) => setRegistroData({ ...registroData, primerApellido: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="segundoApellidoDoc">Segundo Apellido</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                              <Input
                                id="segundoApellidoDoc"
                                placeholder="Ej: Martínez"
                                value={registroData.segundoApellido}
                                onChange={(e) => setRegistroData({ ...registroData, segundoApellido: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="space-y-2">
                      <Label htmlFor="nombreUsuario">Nombre de Usuario *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                        <Input
                          id="nombreUsuario"
                          placeholder="Ej: maria.garcia"
                          value={registroData.nombreUsuario}
                          onChange={(e) => setRegistroData({ ...registroData, nombreUsuario: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="correoRegistro">Correo Electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                        <Input
                          id="correoRegistro"
                          type="email"
                          placeholder="tu@universidad.edu.co"
                          value={registroData.correo}
                          onChange={(e) => setRegistroData({ ...registroData, correo: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contrasenaRegistro">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                        <Input
                          id="contrasenaRegistro"
                          type={mostrarContrasenaRegistro ? 'text' : 'password'}
                          placeholder="********"
                          value={registroData.contrasena}
                          onChange={(e) => setRegistroData({ ...registroData, contrasena: e.target.value })}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarContrasenaRegistro(!mostrarContrasenaRegistro)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {mostrarContrasenaRegistro ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmarContrasena">Confirmar Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                        <Input
                          id="confirmarContrasena"
                          type={mostrarConfirmarContrasena ? 'text' : 'password'}
                          placeholder="********"
                          value={registroData.confirmarContrasena}
                          onChange={(e) => setRegistroData({ ...registroData, confirmarContrasena: e.target.value })}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {mostrarConfirmarContrasena ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    {errorRegistro && (
                      <Alert variant="destructive">
                        <AlertDescription>{errorRegistro}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setModalAbierto(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Crear Cuenta
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Cuentas de Demostración */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Cuentas de Demostración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cuentasDemo.map((cuenta, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <cuenta.icono className={`h-5 w-5 ${cuenta.color}`} />
                  <div>
                    <p className="font-medium text-gray-800">{cuenta.tipo}</p>
                    <p className="text-sm text-gray-600">{cuenta.descripcion}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Correo: {cuenta.correo}</p>
                  <p className="text-xs text-gray-500">Contraseña: {cuenta.contrasena}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
