# Prompt: JWT Guard i dekorator CurrentUser (Etap 2)

## Kontekst projektu

Backend: NestJS 11, `@nestjs/jwt` zainstalowany.
JWT jest generowany w `AuthService.signIn()` z payloadem `{ sub: user.id, email: user.email }`.
`JwtModule` jest zarejestrowany w `AuthModule` z kluczem z `ConfigService` (`JWT_SECRET`).

Istniejące puste katalogi do uzupełnienia:

- `backend/src/common/guards/` — tu trafi guard
- `backend/src/common/decorators/` — tu trafi dekorator
- `backend/src/common/pipes/` — opcjonalnie ValidationPipe
- `backend/src/common/filters/` — opcjonalnie globalny filter wyjątków

---

## Zadanie 1: JwtAuthGuard

Utwórz `backend/src/common/guards/jwt-auth.guard.ts`:

```typescript
// Implementacja powinna:
// 1. Rozszerzać AuthGuard('jwt') z @nestjs/passport LUB
//    ręcznie weryfikować token przez JwtService (bez passport — preferowane dla prostoty)
// 2. Pobierać token z nagłówka Authorization: Bearer <token>
// 3. Weryfikować przez JwtService.verifyAsync() z JWT_SECRET z ConfigService
// 4. Ustawiać request.user = { id: payload.sub, email: payload.email }
// 5. Rzucać UnauthorizedException gdy brak/nieprawidłowy token
```

**Preferowana implementacja bez passport** (`@nestjs/passport` nie jest zainstalowany):

```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Wyodrębnij token z nagłówka Authorization
    // Zweryfikuj przez jwtService.verifyAsync(token, { secret })
    // Ustaw request['user'] = payload
    // Rzuć UnauthorizedException w razie błędu
  }
}
```

`JwtAuthGuard` musi być eksportowany jako `Injectable` i dostępny do importu w każdym module.
Dodaj go do `AuthModule` jako provider i wyeksportuj, lub zarejestruj globalnie w `AppModule`.

---

## Zadanie 2: Dekorator @CurrentUser()

Utwórz `backend/src/common/decorators/current-user.decorator.ts`:

```typescript
// Dekorator parametru metody kontrolera
// Pobiera z request.user obiekt { id: number, email: string }
// lub konkretne pole jeśli podano klucz: @CurrentUser('id')

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user?.[data] : user
  },
)
```

---

## Zadanie 3: Zabezpieczenie endpointów

Dodaj `@UseGuards(JwtAuthGuard)` do wszystkich kontrolerów z wyjątkiem:

- `POST /auth/login` (AuthController — brak guard)
- `POST /users` (rejestracja — brak guard)

Konkretnie zabezpiecz:

- `UsersController`: `PATCH /users/:id`, `GET /users`, `POST /users/:id/change-password`
- `ProfileController` — cały
- `CvController` — cały
- `CvSettingController` — cały
- Wszystkie `data-items` controllers — cały
- Wszystkie `cv-items` controllers — cały

W chronionych endpointach zastąp hardkodowane `id` dekoratorem `@CurrentUser('id')` tam gdzie to logiczne (np. tworzenie zasobu dla zalogowanego użytkownika).

---

## Zadanie 4: Globalny ValidationPipe

W `backend/src/main.ts` dodaj globalny pipe:

```typescript
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
```

`class-validator` i `class-transformer` są już zainstalowane.

---

## Uwagi

- `JwtService` musi być dostępny w guardzie — jeśli guard jest poza `AuthModule`, zarejestruj `JwtModule` jako global lub przekaż przez moduł wspólny (`CommonModule`).
- Nie instaluj `@nestjs/passport` — używaj `JwtService` bezpośrednio.
