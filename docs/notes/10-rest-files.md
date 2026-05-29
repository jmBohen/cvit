# Notatka: Pliki REST (katalog rest/)

## Kontekst

Katalog `rest/` zawiera pliki `.http` do testowania API w VS Code (rozszerzenie REST Client).
Aktualnie istnieje tylko `rest/users/` z 3 plikami.
Należy uzupełnić cały katalog zgodnie ze wszystkimi endpointami aplikacji.

---

## Docelowa struktura katalogów

```
rest/
  auth/
    login.http
  users/
    create.http          ← istnieje
    findByEmail.http     ← istnieje
    patch.http           ← istnieje
    changePassword.http
  profile/
    get.http
    upsert.http
  cv/
    create.http
    findAll.http
    findOne.http
    findFull.http
    patch.http
    delete.http
  cv-settings/
    upsert.http
  experience/
    create.http
    findAll.http
    patch.http
    delete.http
  education/
    create.http
    findAll.http
    patch.http
    delete.http
  technology/
    create.http
    findAll.http
    patch.http
    delete.http
  project/
    create.http
    findAll.http
    patch.http
    delete.http
  certificate/
    create.http
    findAll.http
    patch.http
    delete.http
  language/
    create.http
    findAll.http
    patch.http
    delete.http
  bio/
    create.http
    findAll.http
    patch.http
    delete.http
  activity/
    create.http
    findAll.http
    patch.http
    delete.http
  interest/
    create.http
    findAll.http
    patch.http
    delete.http
  link/
    create.http
    findAll.http
    patch.http
    delete.http
  cv-items/
    experience-cv.http
    education-cv.http
    technology-cv.http
    project-cv.http
    certificate-cv.http
    language-cv.http
```

---

## Wzorzec dla plików z autoryzacją

Każdy plik dotyczący chronionych endpointów musi zawierać nagłówek `Authorization`.
Używaj zmiennej `@token` zdefiniowanej raz na górze pliku lub w osobnym `_vars.http`.

Przykład `rest/_vars.http`:

```http
@baseUrl = http://localhost:3000
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Zawartość plików do utworzenia

### `rest/auth/login.http`

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "Trudne12@"
}
```

### `rest/users/changePassword.http`

```http
POST {{baseUrl}}/users/1/change-password
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "oldPassword": "Trudne12@",
  "newPassword1": "NoweHaslo1!",
  "newPassword2": "NoweHaslo1!"
}
```

### `rest/profile/upsert.http`

```http
PUT {{baseUrl}}/profile
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "phone": "+48 123 456 789",
  "city": "Warszawa",
  "country": "Polska",
  "githubUrl": "https://github.com/jankowalski",
  "linkedinUrl": "https://linkedin.com/in/jankowalski"
}
```

### `rest/cv/create.http`

```http
POST {{baseUrl}}/cv
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Backend Dev @ Allegro",
  "targetCompany": "Allegro",
  "jobOfferUrl": "https://allegro.pl/praca/backend-developer"
}
```

### `rest/cv/findFull.http`

```http
GET {{baseUrl}}/cv/1/full
Authorization: Bearer {{token}}
```

### `rest/experience/create.http`

```http
POST {{baseUrl}}/experience
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "company": "Przykładowa Sp. z o.o.",
  "position": "Junior Backend Developer",
  "startDate": "2023-07-01",
  "isCurrent": true,
  "description": "Rozwój API w NestJS, integracja z PostgreSQL.",
  "city": "Warszawa",
  "country": "Polska"
}
```

### `rest/technology/create.http`

```http
POST {{baseUrl}}/technology
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "TypeScript",
  "level": "advanced",
  "category": "Backend"
}
```

### `rest/cv-items/experience-cv.http`

```http
# Dodaj doświadczenie do CV
POST {{baseUrl}}/cv/1/experience
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "experienceId": 1
}

###

# Pobierz doświadczenia w CV
GET {{baseUrl}}/cv/1/experience
Authorization: Bearer {{token}}

###

# Usuń doświadczenie z CV
DELETE {{baseUrl}}/cv/1/experience/1
Authorization: Bearer {{token}}
```

---

## Uwagi

- Każdy plik `.http` może zawierać wiele requestów oddzielonych `###`
- Zmienną `@token` uzupełniaj po zalogowaniu przez `rest/auth/login.http`
- Pliki `findAll.http` i `delete.http` twórz analogicznie do wzorca z `experience`
- Nie commituj pliku `_vars.http` jeśli zawiera prawdziwy token — dodaj go do `.gitignore` (`rest/_vars.http`)
