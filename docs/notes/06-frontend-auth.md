# Prompt: Frontend — autentykacja (Etap 6)

## Kontekst projektu

Frontend po Etapie 5: router, axios client, hook `useAuth` gotowe.
Backend endpointy: `POST /auth/login` → `{ accessToken }`, `POST /users` → obiekt użytkownika.

---

## Zadanie 1: Strona logowania

### `frontend/src/pages/LoginPage.tsx`

Formularz z polami `email` i `password`.

Zachowanie:

1. Submit → wywołaj `login({ email, password })` z `api/auth.ts`
2. Po sukcesie: `saveToken(accessToken)` → `navigate('/')`
3. Przy błędzie 401: wyświetl komunikat "Nieprawidłowy email lub hasło"
4. Przycisk "Nie masz konta? Zarejestruj się" → `navigate('/register')`
5. Walidacja po stronie klienta: oba pola wymagane, email poprawny format

```typescript
// Szkielet
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { accessToken } = await login({ email, password });
      saveToken(accessToken);
      navigate('/');
    } catch {
      setError('Nieprawidłowy email lub hasło');
    } finally {
      setIsLoading(false);
    }
  };

  return (/* formularz */);
}
```

---

## Zadanie 2: Strona rejestracji

### `frontend/src/pages/RegisterPage.tsx`

Formularz z polami: `firstName`, `email`, `password`, `passwordConfirm`.

Zachowanie:

1. Walidacja: hasła muszą być zgodne, hasło min. 8 znaków (wielka litera, cyfra, symbol)
2. Submit → wywołaj `register({ email, password, firstName })`
3. Po sukcesie: od razu zaloguj użytkownika (`login()`) → `saveToken()` → `navigate('/')`
4. Przy błędzie (np. email zajęty): wyświetl komunikat serwera
5. Link do strony logowania

---

## Zadanie 3: AuthContext (opcjonalny, ale zalecany)

Jeśli `useAuth` zwraca tylko lokalny stan, użytkownik straci stan po nawigacji.
Utwórz `frontend/src/context/AuthContext.tsx` z `React.createContext` i owiń `RouterProvider` w `AuthProvider`.

```typescript
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(/* ... */);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth(); // hook z hooks/useAuth.ts
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
```

---

## Zadanie 4: ProtectedRoute

### `frontend/src/router/ProtectedRoute.tsx`

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

---

## Zadanie 5: Przycisk wylogowania

W `AppLayout.tsx` dodaj przycisk wylogowania:

```typescript
const { logout } = useAuthContext()
const navigate = useNavigate()

const handleLogout = () => {
  logout()
  navigate('/login')
}
```

---

## Uwagi stylowe

- Nie używaj zewnętrznych bibliotek UI (np. MUI, Ant Design) — proste HTML + CSS Modules lub Tailwind jeśli dodasz
- Formularz musi mieć atrybut `noValidate` i obsługiwać walidację ręcznie
- Pola password używaj `type="password"`
- Nie loguj tokenów ani haseł do konsoli
