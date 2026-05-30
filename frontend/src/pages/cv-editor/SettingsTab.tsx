import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCvFull, upsertCvSettings } from '../../api/cv';

const ALL_SECTIONS = [
  { id: 'bio', label: 'Podsumowanie zawodowe (Bio)' },
  { id: 'technologies', label: 'Technologie' },
  { id: 'experience', label: 'Doświadczenie zawodowe' },
  { id: 'education', label: 'Edukacja' },
  { id: 'projects', label: 'Projekty' },
  { id: 'activities', label: 'Aktywność dodatkowa' },
  { id: 'certificates', label: 'Certyfikaty' },
  { id: 'languages', label: 'Języki' },
  { id: 'interests', label: 'Zainteresowania' },
];

export default function SettingsTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: cv } = useQuery({
    queryKey: ['cv-full', cvId],
    queryFn: () => getCvFull(cvId),
  });

  const currentSettings = cv?.settings?.[0] || {};
  const currentOrder = currentSettings.sectionOrder || ALL_SECTIONS.map(s => s.id);
  
  const [sectionOrder, setSectionOrder] = useState<string[]>(currentOrder);
  const [showPhoto, setShowPhoto] = useState<boolean>(currentSettings.showPhoto ?? true);
  const [showEmail, setShowEmail] = useState<boolean>(currentSettings.showEmail ?? true);
  const [showPhone, setShowPhone] = useState<boolean>(currentSettings.showPhone ?? true);

  useEffect(() => {
    if (currentSettings.sectionOrder) {
      setSectionOrder(currentSettings.sectionOrder);
    } else {
      setSectionOrder(ALL_SECTIONS.map(s => s.id));
    }
    setShowPhoto(currentSettings.showPhoto ?? true);
    setShowEmail(currentSettings.showEmail ?? true);
    setShowPhone(currentSettings.showPhone ?? true);
  }, [currentSettings]);

  const mutation = useMutation({
    mutationFn: (data: any) => upsertCvSettings(cvId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
      queryClient.invalidateQueries({ queryKey: ['cv-full', cvId] });
    }
  });

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSectionOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setSectionOrder(newOrder);
  };

  const handleSave = () => {
    mutation.mutate({ sectionOrder, showPhoto, showEmail, showPhone });
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Ustawienia wyglądu CV</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Dane kontaktowe i nagłówek</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="text-sm text-slate-700">Pokaż zdjęcie profilowe</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="text-sm text-slate-700">Pokaż adres email</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="text-sm text-slate-700">Pokaż numer telefonu</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Kolejność sekcji</h4>
          <p className="text-xs text-slate-500 mb-4">Ustaw kolejność, w jakiej sekcje będą wyświetlane na wygenerowanym dokumencie CV.</p>
          
          <ul className="space-y-2">
            {sectionOrder.map((sectionId, index) => {
              const section = ALL_SECTIONS.find(s => s.id === sectionId);
              if (!section) return null;
              
              return (
                <li key={section.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <span className="text-sm font-medium text-slate-700">{index + 1}. {section.label}</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button 
                      onClick={() => moveDown(index)}
                      disabled={index === sectionOrder.length - 1}
                      className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mutation.isPending ? 'Zapisywanie...' : 'Zapisz ustawienia'}
        </button>
      </div>
    </div>
  );
}
