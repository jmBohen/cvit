import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function AppLayout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>CV IT App</h2>
        <button onClick={handleLogout}>Wyloguj się</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
