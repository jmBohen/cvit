import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { register, login } from '../api/auth';
import axios from 'axios';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useAuthContext();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password || !passwordConfirm) {
      setError('Wszystkie pola są wymagane');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Hasła nie są zgodne');
      return;
    }

    if (!validatePassword(password)) {
      setError('Hasło musi mieć min. 8 znaków, dużą literę, cyfrę i znak specjalny.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await register({ firstName, email, password });
      const { accessToken } = await login({ email, password });
      saveToken(accessToken);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(Array.isArray(err.response.data.message) ? err.response.data.message[0] : err.response.data.message);
      } else {
        setError('Wystąpił błąd podczas rejestracji');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Rejestracja</h2>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px' }}>Imię:</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Hasło:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="passwordConfirm" style={{ display: 'block', marginBottom: '5px' }}>Potwierdź hasło:</label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>
      </form>
      <p style={{ textAlign: 'center' }}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
}
