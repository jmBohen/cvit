# Kolejność kroków — jak to implementować

Każdy krok: otwórz odpowiedni plik z notatek, wklej jego treść do Copilot Chat (Agent mode),
poczekaj na implementację, przejrzyj zmiany, commituj.

---

## Przed startem

```
git checkout backend
git checkout -b feat/entities
```

---

## Krok 1 — Encje TypeORM

**Plik:** `01-backend-entities.md`

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/01-backend-entities.md i zaimplementuj wszystkie opisane tam encje TypeORM. Nie zmieniaj User entity. Upewnij się że każdy moduł importuje swoją encję przez TypeOrmModule.forFeature.
```

Po zakończeniu:

```
git add backend/src
git commit -m "feat: add Profile entity with contact fields and User relation"
# osobny commit na każde 2-3 encje
git checkout backend && git merge --no-ff feat/entities -m "feat: implement all TypeORM entities"
git branch -d feat/entities
```

---

## Krok 2 — JWT Guard

```
git checkout -b feat/jwt-guard
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/02-backend-jwt-guard.md i zaimplementuj JwtAuthGuard, dekorator @CurrentUser oraz globalny ValidationPipe zgodnie z instrukcjami. Nie instaluj @nestjs/passport.
```

Po zakończeniu:

```
git add backend/src/common
git commit -m "feat: add JwtAuthGuard with manual JWT verification"
git add backend/src
git commit -m "feat: add @CurrentUser decorator and secure protected endpoints"
git checkout backend && git merge --no-ff feat/jwt-guard -m "feat: implement JWT guard and route protection"
git branch -d feat/jwt-guard
```

---

## Krok 3 — CRUD data-items

```
git checkout -b feat/data-items-crud
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/03-backend-data-items.md i zaimplementuj serwisy, kontrolery i DTOs dla wszystkich 10 modułów data-items. Stosuj wzorzec z ExperienceService. Każdy zasób filtruj po userId z @CurrentUser.
```

Commituj moduł po module:

```
git commit -m "feat: implement experience CRUD service and controller"
git commit -m "feat: implement education and certificate CRUD"
# itd.
git checkout backend && git merge --no-ff feat/data-items-crud -m "feat: implement CRUD for all 10 data-item modules"
git branch -d feat/data-items-crud
```

---

## Krok 4 — Moduł CV

```
git checkout -b feat/cv-module
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/04-backend-cv-module.md i zaimplementuj CvService, cv-items serwisy, endpoint GET /cv/:id/full oraz ProfileService zgodnie z instrukcjami.
```

```
git commit -m "feat: implement CvService with CRUD and user ownership check"
git commit -m "feat: implement cv-items services for adding items to CV"
git commit -m "feat: add GET /cv/:id/full endpoint with all relations"
git commit -m "feat: implement ProfileService with upsert"
git checkout backend && git merge --no-ff feat/cv-module -m "feat: implement CV module with cv-items and profile"
git branch -d feat/cv-module
```

---

## Krok 4b — Pliki REST

```
git checkout -b feat/rest-files
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/10-rest-files.md i utwórz wszystkie opisane tam pliki .http w katalogu rest/. Użyj zmiennych @baseUrl i @token.
```

```
git add rest/
git commit -m "feat: add REST client files for all API endpoints"
git checkout backend && git merge --no-ff feat/rest-files -m "feat: add REST client test files"
git branch -d feat/rest-files
```

---

## Krok 5 — Frontend setup

```
git checkout frontend
git checkout -b feat/frontend-setup
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/05-frontend-setup.md i skonfiguruj frontend: zainstaluj zależności, utwórz strukturę katalogów, axios client z interceptorem JWT, router z ProtectedRoute, zaktualizuj main.tsx.
```

```
git commit -m "chore: install react-router-dom, axios, @tanstack/react-query"
git commit -m "feat: add axios client with JWT interceptor"
git commit -m "feat: add router with ProtectedRoute and page structure"
git checkout frontend && git merge --no-ff feat/frontend-setup -m "feat: set up frontend routing and HTTP client"
git branch -d feat/frontend-setup
```

---

## Krok 6 — Autentykacja frontend

```
git checkout -b feat/auth-pages
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/06-frontend-auth.md i zaimplementuj strony LoginPage, RegisterPage, AuthContext oraz ProtectedRoute.
```

```
git commit -m "feat: add AuthContext with token persistence"
git commit -m "feat: implement LoginPage with form validation"
git commit -m "feat: implement RegisterPage with password confirmation"
git checkout frontend && git merge --no-ff feat/auth-pages -m "feat: implement authentication pages and context"
git branch -d feat/auth-pages
```

---

## Krok 7 — Edytor CV

```
git checkout -b feat/cv-editor
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/07-frontend-cv-editor.md i zaimplementuj DashboardPage z listą CV, CvEditorPage z zakładkami dla każdego typu sekcji oraz formularze dodawania danych.
```

Commituj zakładkę po zakładce:

```
git commit -m "feat: add DashboardPage with CV list and create form"
git commit -m "feat: add CvEditorPage with tab navigation"
git commit -m "feat: implement TechnologiesTab with checkbox selection"
git commit -m "feat: implement ExperienceTab with add form"
# itd.
git checkout frontend && git merge --no-ff feat/cv-editor -m "feat: implement CV editor with all section tabs"
git branch -d feat/cv-editor
```

---

## Krok 8 — Eksport PDF

```
git checkout -b feat/pdf-export
```

Wklej do Copilot Chat:

```
Przeczytaj plik docs/notes/08-pdf-export.md. Zaimplementuj eksport PDF metodą B (window.print z CSS @media print) jako najprostszą do MVP. Dodaj stronę /cv/:id/preview i przycisk w edytorze.
```

```
git commit -m "feat: add CV preview page with print styles"
git commit -m "feat: add download PDF button to CV editor"
git checkout frontend && git merge --no-ff feat/pdf-export -m "feat: implement PDF export via print"
git branch -d feat/pdf-export
```

---

## Na koniec — merge do main

```
git checkout main
git merge --no-ff backend -m "feat: merge backend MVP"
git merge --no-ff frontend -m "feat: merge frontend MVP"
git push origin main backend frontend
```
