# Przewodnik zarządzania Git — cvit

## Stan obecny

- Branche: `main`, `backend`, `frontend`
- Historia commitów: przyrostowa, logiczna, z prefixami Conventional Commits ✅
- Obecna gałąź: `backend`

---

## Strategia branchowania

```
main
├── backend          ← aktywna praca backendowa
│   ├── feat/entities
│   ├── feat/jwt-guard
│   ├── feat/data-items-crud
│   └── feat/cv-module
└── frontend         ← aktywna praca frontendowa
    ├── feat/auth-pages
    ├── feat/cv-editor
    └── feat/pdf-export
```

**Zasada:** każdy etap z planu MVP to osobna gałąź feature, mergowana do `backend` lub `frontend` po zakończeniu. `main` to zawsze działający, stabilny kod.

---

## Konwencja commitów (Conventional Commits)

Format już stosowany w projekcie — trzymaj się go konsekwentnie:

```
<type>: <krótki opis w czasie teraźniejszym, po angielsku>

Opcjonalnie: dłuższy opis po pustej linii
```

**Typy:**
| Typ | Kiedy |
|-----|-------|
| `feat:` | nowa funkcjonalność |
| `fix:` | naprawa błędu |
| `refactor:` | zmiana kodu bez zmiany zachowania |
| `test:` | dodanie/zmiana testów |
| `chore:` | konfiguracja, zależności, CI |
| `docs:` | dokumentacja |

**Przykłady dobrych commitów:**

```
feat: implement Experience entity with TypeORM decorators
feat: add CRUD service for technology data-item
fix: handle nullable endDate in experience service
refactor: extract user ownership check to shared helper
chore: add @types/bcrypt to devDependencies
```

**Czego unikać:**

```
# ŹLE — za duże
feat: implement all entities and services and guards

# ŹLE — nieinformatywne
update, fix, changes, wip

# ŹLE — po polsku (projekt open source)
feat: dodaj encję użytkownika
```

---

## Granularność commitów

Każdy commit powinien reprezentować **jeden logiczny krok**. Przy implementacji encji:

```bash
# Krok 1
git commit -m "feat: add Profile entity with contact fields and User relation"

# Krok 2
git commit -m "feat: add Cv entity with targeting fields (company, jobOfferUrl)"

# Krok 3
git commit -m "feat: add Experience entity with date range and isCurrent flag"

# itd.
```

Nie commituj wszystkich 20 encji w jednym commicie.

---

## Workflow dla każdego etapu MVP

```bash
# 1. Utwórz gałąź z odpowiedniego miejsca
git checkout backend
git checkout -b feat/entities

# 2. Pracuj małymi krokami, commituj często
git add backend/src/core/profile/entities/profile.entity.ts
git commit -m "feat: add Profile entity with contact fields and User relation"

# 3. Po zakończeniu etapu — merge do backend
git checkout backend
git merge --no-ff feat/entities -m "feat: implement all TypeORM entities and relations"

# 4. Usuń gałąź feature po merge
git branch -d feat/entities
```

---

## .gitignore — co musi być wykluczone

Obecny `.gitignore` pomija `.env` — **sprawdź czy `backend/keys/.env` nie jest przypadkowo śledzony:**

```bash
git ls-files backend/keys/
```

Jeśli pojawia się `.env` w wyniku — usuń go z indeksu:

```bash
git rm --cached backend/keys/.env
git commit -m "chore: remove .env from tracking"
```

Do `.gitignore` warto też dodać:

```
# IDE
.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Frontend build
frontend/dist/

# Keys folder - never commit secrets
backend/keys/
```

---

## Co NIE powinno trafić do repozytorium

- Klucze JWT, hasła do bazy (`backend/keys/.env`) — **zawsze w .gitignore**
- Tokeny API, sekrety OAuth
- Wygenerowany kod PDF (pliki binarne)
- `node_modules/`, `dist/`, `.env.*`

---

## Harmonogram commitów przy implementacji MVP

| Etap                     | Spodziewana liczba commitów   |
| ------------------------ | ----------------------------- |
| Encje (Etap 1)           | 8–12 (po 1-2 encje na commit) |
| JWT Guard (Etap 2)       | 3–4                           |
| data-items CRUD (Etap 3) | 5–8                           |
| Moduł CV (Etap 4)        | 4–6                           |
| Frontend setup (Etap 5)  | 2–3                           |
| Frontend auth (Etap 6)   | 4–5                           |
| Frontend edytor (Etap 7) | 6–10                          |
| Eksport PDF (Etap 8)     | 3–4                           |

Łącznie: ~35–52 commity do końca projektu — rozsądna, naturalna liczba dla projektu semestralnego.
