import { useState } from "react";
import API from "../servicios/api";

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        // Login Flow
        const res = await API.post("/usuario/login", form);
        const { token } = res.data;
        if (token) {
          localStorage.setItem("token", token);
          onLoginSuccess();
        }
      } else {
        // Signup Flow
        await API.post("/usuario/signup", form);
        // After signup, automatically login
        const loginRes = await API.post("/usuario/login", form);
        const { token } = loginRes.data;
        if (token) {
          localStorage.setItem("token", token);
          onLoginSuccess();
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Ingresa a tu cuenta para gestionar pedidos." : "Regístrate para empezar a pedir."}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="Ej: juanperez123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse y Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Crea una aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Auth;
