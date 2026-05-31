import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCvFull, updateCv } from '../api/cv';
import BioTab from './cv-editor/BioTab';
import TechnologiesTab from './cv-editor/TechnologiesTab';
import ExperienceTab from './cv-editor/ExperienceTab';
import EducationTab from './cv-editor/EducationTab';
import ProjectsTab from './cv-editor/ProjectsTab';
import CertificatesTab from './cv-editor/CertificatesTab';
import LanguagesTab from './cv-editor/LanguagesTab';
import LinksTab from './cv-editor/LinksTab';
import InterestsTab from './cv-editor/InterestsTab';
import ActivitiesTab from './cv-editor/ActivitiesTab';
import SettingsTab from './cv-editor/SettingsTab';

export default function CvEditorPage() {
  const { id } = useParams<{ id: string }>();
  const cvId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('bio');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');

  const { data: cv, isLoading } = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCvFull(cvId),
  });

  const updateCvMutation = useMutation({
    mutationFn: (data: any) => updateCv(cvId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
      queryClient.invalidateQueries({ queryKey: ['cv-full', cvId] });
      queryClient.invalidateQueries({ queryKey: ['cv-list'] });
      setIsEditingHeader(false);
    }
  });

  const startEditingHeader = () => {
    setEditName(cv?.name || '');
    setEditCompany(cv?.targetCompany || '');
    setIsEditingHeader(true);
  };

  const handleSaveHeader = () => {
    if (!editName.trim()) return;
    updateCvMutation.mutate({ name: editName, targetCompany: editCompany });
  };

  if (isLoading) return <div className="flex justify-center items-center py-20 text-slate-500">Ładowanie edytora CV...</div>;
  if (!cv) return <div className="text-center py-12 text-slate-500">Nie znaleziono CV</div>;

  const tabs = [
    { id: 'bio', label: 'Bio' },
    { id: 'experience', label: 'Doświadczenie' },
    { id: 'education', label: 'Edukacja' },
    { id: 'projects', label: 'Projekty' },
    { id: 'technologies', label: 'Technologie' },
    { id: 'languages', label: 'Języki' },
    { id: 'certificates', label: 'Certyfikaty' },
    { id: 'links', label: 'Linki' },
    { id: 'interests', label: 'Zainteresowania' },
    { id: 'activities', label: 'Aktywności' },
    { id: 'settings', label: 'Ustawienia' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {isEditingHeader ? (
          <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm mr-0 sm:mr-4 w-full sm:w-auto max-w-xl">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nazwa CV</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Firma docelowa (opcjonalnie)</label>
                <input type="text" value={editCompany} onChange={e => setEditCompany(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveHeader} disabled={updateCvMutation.isPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 shadow-sm">Zapisz</button>
                <button onClick={() => setIsEditingHeader(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">Anuluj</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center mb-2 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Wróć do Dashboardu
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              {cv.name}
              <button onClick={startEditingHeader} className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                Zmień nazwę / firmę
              </button>
            </h2>
            {cv.targetCompany && <p className="text-slate-500 mt-1">Przygotowywane dla: <span className="font-medium">{cv.targetCompany}</span></p>}
          </div>
        )}
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
          <div className={activeTab === 'bio' ? 'block' : 'hidden'}><BioTab cvId={cvId} /></div>
          <div className={activeTab === 'experience' ? 'block' : 'hidden'}><ExperienceTab cvId={cvId} /></div>
          <div className={activeTab === 'education' ? 'block' : 'hidden'}><EducationTab cvId={cvId} /></div>
          <div className={activeTab === 'projects' ? 'block' : 'hidden'}><ProjectsTab cvId={cvId} /></div>
          <div className={activeTab === 'technologies' ? 'block' : 'hidden'}><TechnologiesTab cvId={cvId} /></div>
          <div className={activeTab === 'languages' ? 'block' : 'hidden'}><LanguagesTab cvId={cvId} /></div>
          <div className={activeTab === 'certificates' ? 'block' : 'hidden'}><CertificatesTab cvId={cvId} /></div>
          <div className={activeTab === 'links' ? 'block' : 'hidden'}><LinksTab cvId={cvId} /></div>
          <div className={activeTab === 'interests' ? 'block' : 'hidden'}><InterestsTab cvId={cvId} /></div>
          <div className={activeTab === 'activities' ? 'block' : 'hidden'}><ActivitiesTab cvId={cvId} /></div>
          <div className={activeTab === 'settings' ? 'block' : 'hidden'}><SettingsTab cvId={cvId} /></div>
        </div>
      </div>
    </div>
  );
}
