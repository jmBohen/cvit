# Prompt: Frontend — setup projektu (Etap 5)

## Kontekst projektu

Frontend: React 19, TypeScript, Vite.
Obecny stan: domyślny starter Vite — `App.tsx` zawiera tylko licznik demo.
Backend API działa na `http://localhost:3000`.

---

## Zadanie 1: Instalacja zależności

```bash
cd frontend
npm install react-router-dom axios @tanstack/react-query
npm install -D @types/react-router-dom
```

---

## Zadanie 2: Struktura katalogów

Utwórz następującą strukturę w `frontend/src/`:

```
src/
  api/
    client.ts          ← axios instance z interceptorem JWT
    auth.ts            ← funkcje do /auth i /users
    cv.ts              ← funkcje do /cv
    dataItems.ts       ← funkcje do data-items endpoints
  components/
    ui/                ← proste komponenty (Button, Input, Card)
    layout/
      AppLayout.tsx    ← layout z nawigacją dla zalogowanych
      AuthLayout.tsx   ← layout dla stron logowania/rejestracji
  hooks/
    useAuth.ts         ← hook zarządzający tokenem JWT
  pages/
    LoginPage.tsx
    RegisterPage.tsx
    DashboardPage.tsx
    CvEditorPage.tsx
    NotFoundPage.tsx
  router/
    index.tsx          ← definicja routera
    ProtectedRoute.tsx ← guard dla chronionych stron
  types/
    api.ts             ← TypeScript typy odpowiedzi API
  main.tsx             ← istniejący plik, dodaj QueryClientProvider + RouterProvider
  App.tsx              ← uproszczony, tylko <RouterProvider>
```

---

## Zadanie 3: Klient HTTP

### `frontend/src/api/client.ts`

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

// Interceptor: dodaj token JWT do każdego żądania
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: przy 401 wyloguj użytkownika
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
```

### `frontend/src/api/auth.ts`

```typescript
import apiClient from './client'

export interface LoginPayload {
  email: string
  password: string
}
export interface RegisterPayload {
  email: string
  password: string
  firstName: string
}
export interface AuthResponse {
  accessToken: string
}

export const login = (data: LoginPayload) =>
  apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data)

export const register = (data: RegisterPayload) =>
  apiClient.post('/users', data).then((r) => r.data)
```

---

## Zadanie 4: Hook useAuth

### `frontend/src/hooks/useAuth.ts`

```typescript
import { useState, useCallback } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'))

  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setToken(null)
  }, [])

  return { token, isAuthenticated: !!token, saveToken, logout }
}
```

---

## Zadanie 5: Router

### `frontend/src/router/index.tsx`

```typescript
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CvEditorPage from '../pages/CvEditorPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/cv/:id', element: <CvEditorPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
```

### `frontend/src/router/ProtectedRoute.tsx`

```typescript
// Jeśli użytkownik nie jest zalogowany (brak tokenu) → redirect /login
// Jeśli zalogowany → <Outlet />
```

---

## Zadanie 6: main.tsx

Zaktualizuj `frontend/src/main.tsx`:

```typescript
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
```

---

## Zadanie 7: Zmienne środowiskowe

Utwórz `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

Dodaj do `frontend/.gitignore`:

```
.env
.env.local
```

---

## Typy API (`frontend/src/types/api.ts`)

```typescript
export interface User {
  id: number
  email: string
  firstName: string
  lastName?: string
}

export interface Cv {
  id: number
  name: string
  targetCompany?: string
  jobOfferUrl?: string
  isDefault: boolean
  createdAt: string
}
```
