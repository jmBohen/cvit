import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCvFull } from '../api/cv';

export default function CvPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const cvId = Number(id);
  const navigate = useNavigate();

  const { data: cv, isLoading, error } = useQuery({
    queryKey: ['cv-full', cvId],
    queryFn: () => getCvFull(cvId),
  });

  if (isLoading) return <div className="text-center py-20 text-slate-500 print:hidden">Przygotowywanie dokumentu CV...</div>;
  if (error || !cv) return <div className="text-center py-20 text-red-500 print:hidden">Nie udało się załadować CV.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:m-0">
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden flex justify-between items-center">
        <button 
          onClick={() => navigate(`/cv/${cvId}`)}
          className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
        >
          <svg className="mr-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do edytora
        </button>
        <button 
          onClick={handlePrint}
          className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Drukuj / Zapisz jako PDF
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-[20mm] print:shadow-none print:p-0">
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{cv.user?.firstName} {cv.user?.lastName}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            {cv.user?.email && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {cv.user.email}
              </span>
            )}
            {/* Tutaj potencjalnie numer telefonu czy linki z Profilu */}
          </div>
        </div>

        <div className="space-y-8">
          {cv.bioItems?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Podsumowanie zawodowe</h2>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">{cv.bioItems[0].bio.summary}</p>
            </section>
          )}

          {cv.technologyItems?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Technologie</h2>
              <div className="flex flex-wrap gap-2">
                {cv.technologyItems.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {item.technology.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.experienceItems?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Doświadczenie zawodowe</h2>
              <div className="space-y-5">
                {cv.experienceItems.map((item: any) => (
                  <div key={item.id} className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-bold text-slate-900">{item.experience.position}</h3>
                      <span className="text-sm font-medium text-slate-500">
                        {item.experience.startDate} — {item.experience.isCurrent ? 'Obecnie' : item.experience.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      {item.experience.company}{item.experience.city ? `, ${item.experience.city}` : ''}
                    </div>
                    {item.experience.description && (
                      <p className="text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">{item.experience.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.educationItems?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Edukacja</h2>
              <div className="space-y-4">
                {cv.educationItems.map((item: any) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-bold text-slate-900">{item.education.school}</h3>
                      <span className="text-sm font-medium text-slate-500">
                        {item.education.startDate} — {item.education.isCurrent ? 'W trakcie' : item.education.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {item.education.fieldOfStudy} {item.education.degree && `(${item.education.degree})`}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.projectItems?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Projekty</h2>
              <div className="space-y-4">
                {cv.projectItems.map((item: any) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-bold text-slate-900">{item.project.name}</h3>
                      {(item.project.githubUrl || item.project.liveUrl) && (
                        <div className="text-xs text-blue-600 flex gap-2">
                          {item.project.githubUrl && <a href={item.project.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                          {item.project.liveUrl && <a href={item.project.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">Live Demo</a>}
                        </div>
                      )}
                    </div>
                    {item.project.techStack && (
                      <div className="text-xs font-mono text-slate-500 mb-1">{item.project.techStack}</div>
                    )}
                    {item.project.description && (
                      <p className="text-sm text-slate-700 leading-relaxed text-justify">{item.project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(cv.certificateItems?.length > 0 || cv.languageItems?.length > 0) && (
            <div className="grid grid-cols-2 gap-8">
              {cv.certificateItems?.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Certyfikaty</h2>
                  <ul className="space-y-2">
                    {cv.certificateItems.map((item: any) => (
                      <li key={item.id} className="text-sm">
                        <span className="font-bold text-slate-900">{item.certificate.name}</span>
                        <span className="text-slate-600 ml-1">({item.certificate.issuer})</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {cv.languageItems?.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Języki</h2>
                  <ul className="space-y-2">
                    {cv.languageItems.map((item: any) => (
                      <li key={item.id} className="text-sm flex justify-between">
                        <span className="font-medium text-slate-900">{item.language.name}</span>
                        <span className="text-slate-500 font-semibold">{item.language.level}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
