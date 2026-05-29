import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCvFull } from '../api/cv';
import TechnologiesTab from './cv-editor/TechnologiesTab';
import ExperienceTab from './cv-editor/ExperienceTab';
import EducationTab from './cv-editor/EducationTab';
import ProjectsTab from './cv-editor/ProjectsTab';
import CertificatesTab from './cv-editor/CertificatesTab';
import LanguagesTab from './cv-editor/LanguagesTab';

export default function CvEditorPage() {
  const { id } = useParams<{ id: string }>();
  const cvId = Number(id);
  const [activeTab, setActiveTab] = useState('technologies');

  const { data: cv, isLoading } = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCvFull(cvId),
  });

  if (isLoading) return <div className="flex justify-center items-center py-20 text-slate-500">Ładowanie edytora CV...</div>;
  if (!cv) return <div className="text-center py-12 text-slate-500">Nie znaleziono CV</div>;

  const tabs = [
    { id: 'technologies', label: 'Technologie' },
    { id: 'experience', label: 'Doświadczenie' },
    { id: 'education', label: 'Edukacja' },
    { id: 'projects', label: 'Projekty' },
    { id: 'certificates', label: 'Certyfikaty' },
    { id: 'languages', label: 'Języki' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Wróć do Dashboardu
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {cv.name}
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-normal border border-slate-200 cursor-pointer hover:bg-slate-200">
              Zmień nazwę
            </span>
          </h2>
          {cv.targetCompany && <p className="text-slate-500 mt-1">Przygotowywane dla: {cv.targetCompany}</p>}
        </div>
        <button 
          onClick={() => navigate(`/cv/${cvId}/preview`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Podgląd PDF
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden mb-6">
        <div className="border-b border-slate-200 overflow-x-auto hide-scrollbar">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 bg-slate-50/50">
          {activeTab === 'technologies' && <TechnologiesTab cvId={cvId} />}
          {activeTab === 'experience' && <ExperienceTab cvId={cvId} />}
          {activeTab === 'education' && <EducationTab cvId={cvId} />}
          {activeTab === 'projects' && <ProjectsTab cvId={cvId} />}
          {activeTab === 'certificates' && <CertificatesTab cvId={cvId} />}
          {activeTab === 'languages' && <LanguagesTab cvId={cvId} />}
        </div>
      </div>
    </div>
  );
}
