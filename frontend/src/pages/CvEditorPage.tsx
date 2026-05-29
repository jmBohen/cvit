import { useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (isLoading) return <div>Ładowanie CV...</div>;
  if (!cv) return <div>Nie znaleziono CV</div>;

  return (
    <div>
      <div style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '20px', borderRadius: '5px' }}>
        <h2>Nazwa CV: {cv.name} [Edytuj nazwę]</h2>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['technologies', 'experience', 'education', 'projects', 'certificates', 'languages'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {activeTab === 'technologies' && <TechnologiesTab cvId={cvId} />}
        {activeTab === 'experience' && <ExperienceTab cvId={cvId} />}
        {activeTab === 'education' && <EducationTab cvId={cvId} />}
        {activeTab === 'projects' && <ProjectsTab cvId={cvId} />}
        {activeTab === 'certificates' && <CertificatesTab cvId={cvId} />}
        {activeTab === 'languages' && <LanguagesTab cvId={cvId} />}
      </div>
    </div>
  );
}
