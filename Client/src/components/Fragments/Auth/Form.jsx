"use client";

import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Definisikan fungsi logout di luar komponen LoginForm
export const logout = (navigate) => {
  localStorage.removeItem('token'); // Menghapus token dari localStorage
  navigate('/login'); // Mengarahkan pengguna ke halaman login
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });

      const token = response.data.token;
      const userId = response.data.userId; // Asumsi bahwa 'userId' dikirim sebagai bagian dari respons
      localStorage.setItem('token', token); // Simpan token di localStorage
      localStorage.setItem('userId', userId); // Simpan ID pengguna ke localStorage
      setToken(token);
      navigate('/sag', { replace: true }); // redirect to /sag
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="email" value="Alamat Email" />
        </div>
        <TextInput
          id="email"
          type="email"
          placeholder="contoh@mail.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="password" value="Password" />
        </div>
        <TextInput
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <Button color="warning" type="submit">
        Kirim
      </Button>
      {token && <p>Logged in successfully!</p>}
      <Button color="danger" onClick={() => logout(navigate)}>
  Logout
</Button>
    </form>
  );
}

export { LoginForm };

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // tambahkan state untuk role
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/register', {
        username,
        email,
        password,
        role, // tambahkan role pada data yang dikirim
      });

      console.log(response.data);
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="username" value="Username" />
        </div>
        <TextInput
          id="username"
          type="text"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="email" value="Alamat Email" />
        </div>
        <TextInput
          id="email"
          type="email"
          placeholder="contoh@mail.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="password" value="Password" />
        </div>
        <TextInput
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label className="text-white" htmlFor="role" value="Role" />
        </div>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full p-2 rounded-lg"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button color="warning" type="submit">
        Kirim
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export { RegisterForm };