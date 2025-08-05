import React, { useState } from 'react';
import { registerRequest } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', role: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerRequest(form);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="role"
          placeholder="Rol"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
