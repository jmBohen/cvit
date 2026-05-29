# Plan MVP — cvit (połowa semestru)

## Cel

Działająca aplikacja webowa umożliwiająca:

1. Rejestrację i logowanie użytkownika
2. Uzupełnienie danych osobowych (bio)
3. Dodanie sekcji: technologie, doświadczenie, edukacja, projekty, certyfikaty, języki obce
4. Stworzenie co najmniej jednej wersji CV i eksport do PDF

---

## Etapy (kolejność implementacji)

### Etap 1 — Backend: encje i relacje

**Plik promptu:** `01-backend-entities.md`

- [ ] `Profile` entity — dane kontaktowe użytkownika (telefon, miasto, GitHub, LinkedIn)
- [ ] `Cv` entity — wersja CV (nazwa, firma docelowa, link do oferty)
- [ ] `CvSetting` entity — ustawienia wyglądu CV (szablon, język)
- [ ] `Group` entity — grupowanie sekcji CV
- [ ] Encje `data-items`: Bio, Experience, Education, Certificate, Technology, Language, Activity, Interest, Link, Project
- [ ] Encje `cv-items`: BioCv, ExperienceCv, EducationCv, itd. — pozycje wybrane do konkretnego CV

### Etap 2 — Backend: zabezpieczenie endpointów

**Plik promptu:** `02-backend-jwt-guard.md`

- [ ] `JwtAuthGuard` w `common/guards/`
- [ ] Dekorator `@CurrentUser()` w `common/decorators/`
- [ ] Zabezpieczenie wszystkich endpointów poza `/auth/login` i `POST /users`

### Etap 3 — Backend: CRUD dla data-items

**Plik promptu:** `03-backend-data-items.md`

- [ ] Serwisy dla 10 modułów `data-items` z pełnym CRUD + powiązanie z zalogowanym użytkownikiem
- [ ] Walidacja DTOs przez `class-validator`

### Etap 4 — Backend: moduł CV

**Plik promptu:** `04-backend-cv-module.md`

- [ ] `CvService`: tworzenie CV, pobieranie listy CV użytkownika, dodawanie elementów do CV
- [ ] Serwis `cv-items`: wybieranie który `data-item` trafia do danego CV

### Etap 5 — Frontend: setup

**Plik promptu:** `05-frontend-setup.md`

- [ ] Instalacja: `react-router-dom`, `axios`, `@tanstack/react-query`
- [ ] Struktura katalogów: `pages/`, `components/`, `hooks/`, `api/`
- [ ] Globalny `axios` z interceptorem (token JWT z localStorage)
- [ ] Routing: `/login`, `/register`, `/dashboard`, `/cv/:id`

### Etap 6 — Frontend: autentykacja

**Plik promptu:** `06-frontend-auth.md`

- [ ] Strona `/login` — formularz + wywołanie `POST /auth/login`
- [ ] Strona `/register` — formularz + wywołanie `POST /users`
- [ ] `AuthContext` / hook `useAuth` — przechowywanie tokenu
- [ ] ProtectedRoute — przekierowanie niezalogowanych

### Etap 7 — Frontend: edytor CV

**Plik promptu:** `07-frontend-cv-editor.md`

- [ ] Dashboard — lista CV użytkownika
- [ ] Formularz dodawania sekcji (technologie, doświadczenie, edukacja, projekty)
- [ ] Podgląd CV na żywo

### Etap 8 — Eksport PDF

**Plik promptu:** `08-pdf-export.md`

- [ ] Backend: endpoint `GET /cv/:id/pdf` generujący PDF (puppeteer lub `@react-pdf/renderer`)
- [ ] Frontend: przycisk „Pobierz PDF"

---

## Definicja „gotowe do oddania"

- Użytkownik może się zarejestrować, zalogować
- Użytkownik może dodać przynajmniej: bio, technologie, doświadczenie, edukację
- Użytkownik może stworzyć wersję CV z wybranych elementów
- CV można wyeksportować do PDF
- Aplikacja uruchamia się przez `docker-compose up` (backend + DB) i `npm run dev` (frontend)
