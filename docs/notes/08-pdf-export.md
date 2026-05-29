# Prompt: Eksport do PDF (Etap 8)

## Kontekst projektu

Backend: NestJS 11. Frontend: React + Vite.
Po Etapie 7 widok podglądu CV (`/cv/:id/preview`) istnieje jako strona React.

Dwa podejścia do wyboru — **rekomendowane: Podejście A** (prostsze, bez Puppeteer).

---

## Podejście A: PDF renderowany po stronie klienta (@react-pdf/renderer)

### Instalacja (frontend)

```bash
cd frontend
npm install @react-pdf/renderer
npm install -D @types/react-pdf
```

### `frontend/src/components/CvPdfDocument.tsx`

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  text: { fontSize: 10, lineHeight: 1.4 },
  divider: { borderBottom: '1pt solid #ccc', marginVertical: 6 },
});

interface CvPdfDocumentProps {
  cv: FullCv; // typ z types/api.ts
}

export function CvPdfDocument({ cv }: CvPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Nagłówek z danymi osobowymi */}
        <View style={styles.section}>
          <Text style={styles.name}>{cv.user?.firstName} {cv.user?.lastName}</Text>
          {cv.user?.profile?.githubUrl && (
            <Text style={styles.text}>GitHub: {cv.user.profile.githubUrl}</Text>
          )}
        </View>

        {/* Bio */}
        {cv.bioItems?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>O mnie</Text>
            <Text style={styles.text}>{cv.bioItems[0].bio.summary}</Text>
          </View>
        )}

        {/* Technologie */}
        {cv.technologyItems?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Technologie</Text>
            <Text style={styles.text}>
              {cv.technologyItems.map((t) => `${t.technology.name} (${t.technology.level})`).join(' · ')}
            </Text>
          </View>
        )}

        {/* Doświadczenie */}
        {cv.experienceItems?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Doświadczenie</Text>
            {cv.experienceItems.map((item) => (
              <View key={item.id} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
                  {item.experience.position} @ {item.experience.company}
                </Text>
                <Text style={styles.text}>
                  {item.experience.startDate} — {item.experience.isCurrent ? 'obecnie' : item.experience.endDate}
                </Text>
                {item.experience.description && (
                  <Text style={styles.text}>{item.experience.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Dodaj analogicznie: Education, Projects, Certificates, Languages */}
      </Page>
    </Document>
  );
}
```

### Przycisk pobierania w CvEditorPage

```typescript
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvPdfDocument } from '../components/CvPdfDocument';

// W komponencie:
<PDFDownloadLink
  document={<CvPdfDocument cv={cvFull} />}
  fileName={`${cvFull.name ?? 'cv'}.pdf`}
>
  {({ loading }) => (loading ? 'Generowanie...' : 'Pobierz PDF')}
</PDFDownloadLink>
```

---

## Podejście B: Eksport przez window.print() (najprostsze)

Jeśli `@react-pdf/renderer` sprawia problemy, można użyć CSS print:

### `frontend/src/pages/CvPreviewPage.tsx`

```typescript
export default function CvPreviewPage() {
  const { id } = useParams();
  const { data: cv } = useQuery({ queryKey: ['cv-full', id], queryFn: () => getCvFull(Number(id)) });

  return (
    <>
      <button onClick={() => window.print()} className="no-print">
        Drukuj / Zapisz jako PDF
      </button>
      <div className="cv-print-area">
        {/* Renderuj CV jako HTML */}
      </div>
    </>
  );
}
```

### CSS dla druku (`frontend/src/index.css`)

```css
@media print {
  .no-print {
    display: none !important;
  }
  body {
    margin: 0;
  }
  .cv-print-area {
    padding: 20mm;
    font-family: Arial, sans-serif;
  }
}
```

Użytkownik otwiera `/cv/:id/preview` → Ctrl+P → "Zapisz jako PDF".

---

## Podejście C: Backend PDF (Puppeteer) — zaawansowane

Tylko jeśli A i B nie wystarczają:

```bash
cd backend
npm install puppeteer
```

### `backend/src/core/cv/cv.controller.ts` — dodaj endpoint

```typescript
@Get(':id/pdf')
@UseGuards(JwtAuthGuard)
@Header('Content-Type', 'application/pdf')
async downloadPdf(@Param('id') id: number, @CurrentUser('id') userId: number, @Res() res: Response) {
  const pdfBuffer = await this.cvService.generatePdf(id, userId);
  res.set('Content-Disposition', `attachment; filename="cv-${id}.pdf"`);
  res.send(pdfBuffer);
}
```

### `CvService.generatePdf()`

```typescript
async generatePdf(id: number, userId: number): Promise<Buffer> {
  const cv = await this.findFull(id, userId);
  // Renderuj HTML jako string na podstawie danych CV
  const html = renderCvHtml(cv); // helper funkcja

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return Buffer.from(pdf);
}
```

---

## Rekomendacja

Dla MVP akademickiego: **Podejście B** (window.print) — działa natychmiast, zero dodatkowych zależności.
Dla lepszego efektu wizualnego: **Podejście A** (@react-pdf/renderer) — pełna kontrola nad layoutem PDF.
