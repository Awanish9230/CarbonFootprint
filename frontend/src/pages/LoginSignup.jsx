import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginSignup() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', state: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(form.email, form.password);
    } else {
      await register({ name: form.name, email: form.email, password: form.password, state: form.state });
    }
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 mb-3">
        <button className={`px-3 py-1 rounded ${mode==='login'?'bg-emerald-600 text-white':'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setMode('login')}>Login</button>
        <button className={`px-3 py-1 rounded ${mode==='signup'?'bg-emerald-600 text-white':'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setMode('signup')}>Sign Up</button>
      </div>
      <form onSubmit={submit} className="space-y-2">
        {mode === 'signup' && (
          <>
            <input className="input" placeholder="Name" name="name" value={form.name} onChange={onChange} />
            <input className="input" placeholder="State (e.g., Karnataka)" name="state" value={form.state} onChange={onChange} />
          </>
        )}
        <input className="input" placeholder="Email" name="email" value={form.email} onChange={onChange} />
        <input className="input" placeholder="Password" type="password" name="password" value={form.password} onChange={onChange} />
        <button className="px-4 py-2 rounded bg-emerald-600 text-white w-full">{mode==='login'?'Login':'Create Account'}</button>
      </form>
    </div>
  );
}
