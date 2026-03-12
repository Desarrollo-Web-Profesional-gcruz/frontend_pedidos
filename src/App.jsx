
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import PedidoForm from './componentes/PedidoForm'
import PedidoList from './componentes/PedidoList'
import Auth from './componentes/Auth'
import API from './servicios/api'

function PedidosDashboard({ onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOrderAdded = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-6 md:p-10 relative">
      <div className="absolute top-6 right-6 md:top-10 md:right-10">
        <button 
          onClick={onLogout}
          className="bg-white/50 hover:bg-white/80 text-indigo-900 font-semibold py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-10 text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight drop-shadow-sm">
          Sistema de Gestión de Pedidos
        </h1>
        <p className="text-indigo-700 mt-3 text-lg font-medium">
          Registra y administra tus órdenes de manera eficiente
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <PedidoForm onOrderAdded={handleOrderAdded} />
        </div>
        <div className="w-full h-full">
          <PedidoList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)

    // Interceptor global de errores (por si el token expira o envían uno falso a /pedidos)
    const interceptor = API.interceptors.response.use(
      response => response,
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Acceso denegado: Token inválido o expirado.");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  if (isLoading) return null;

  return (
    <Routes>
      {/* Ruta para Iniciar Sesión */}
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? <Navigate to="/pedidos" replace /> 
            : <Auth onLoginSuccess={() => {
                setIsAuthenticated(true);
                navigate("/pedidos");
              }} />
        } 
      />

      {/* Ruta Protegida de Pedidos */}
      <Route 
        path="/pedidos" 
        element={
          isAuthenticated 
            ? <PedidosDashboard onLogout={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                navigate("/login");
              }} />
            : <Navigate to="/login" replace />
        } 
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/pedidos" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}

export default App

