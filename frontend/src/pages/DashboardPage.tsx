import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCvList, createCv, deleteCv } from '../api/cv';
import type { Cv } from '../types/api';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newCvName, setNewCvName] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [isGrouped, setIsGrouped] = useState(false);

  const { data: cvs, isLoading, error } = useQuery<Cv[]>({
    queryKey: ['cv-list'],
    queryFn: getCvList,
  });

  const createMutation = useMutation({
    mutationFn: () => createCv({ name: newCvName, targetCompany }),
    onSuccess: () => {
      setNewCvName('');
      setTargetCompany('');
      queryClient.invalidateQueries({ queryKey: ['cv-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv-list'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCvName) return;
    createMutation.mutate();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć to CV?')) {
      deleteMutation.mutate(id);
    }
  };

  const groupedCvs = useMemo(() => {
    if (!cvs) return {};
    if (!isGrouped) return { 'Wszystkie CV': cvs };

    return cvs.reduce((acc, cv) => {
      const company = cv.targetCompany?.trim() || 'Inne (Brak firmy)';
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(cv);
      return acc;
    }, {} as Record<string, Cv[]>);
  }, [cvs, isGrouped]);

  if (isLoading) return <div className="flex justify-center items-center py-20 text-slate-500">Ładowanie Twoich CV...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm">Wystąpił błąd podczas pobierania CV.</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Zarządzaj swoimi wersjami CV</p>
        </div>
        {cvs && cvs.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">Grupuj według firmy:</span>
            <button
              onClick={() => setIsGrouped(!isGrouped)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isGrouped ? 'bg-blue-600' : 'bg-slate-200'}`}
              role="switch"
              aria-checked={isGrouped}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isGrouped ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Utwórz nowe CV</h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="cvName" className="sr-only">Nazwa CV</label>
            <input
              id="cvName"
              type="text"
              placeholder="Nazwa CV (np. Backend Dev)"
              value={newCvName}
              onChange={(e) => setNewCvName(e.target.value)}
              className="block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="targetCompany" className="sr-only">Firma docelowa</label>
            <input
              id="targetCompany"
              type="text"
              placeholder="Firma docelowa (opcjonalnie)"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="inline-flex justify-center items-center px-6 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
          >
            {createMutation.isPending ? 'Tworzenie...' : 'Utwórz CV'}
          </button>
        </form>
      </div>

      <div>
        {cvs?.length === 0 ? (
          <div className="text-center bg-white border-2 border-dashed border-slate-300 rounded-xl p-12">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">Brak CV</h3>
            <p className="mt-1 text-sm text-slate-500">Nie masz jeszcze żadnego CV. Utwórz pierwsze korzystając z formularza powyżej.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedCvs).map(([groupName, groupCvs]) => (
              <div key={groupName}>
                {isGrouped && (
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                    {groupName} <span className="text-sm font-normal text-slate-500 ml-2">({groupCvs.length})</span>
                  </h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupCvs.map((cv) => (
                    <div key={cv.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                      <div className="p-6 flex-1">
                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{cv.name}</h4>
                        {cv.targetCompany ? (
                          <p className="text-sm text-slate-600 mb-3 flex items-center">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            {cv.targetCompany}
                          </p>
                        ) : (
                          <div className="h-4 mb-3"></div> // Spacer for alignment
                        )}
                        <p className="text-xs text-slate-500">
                          Utworzono: {new Date(cv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between">
                        <button 
                          onClick={() => navigate(`/cv/${cv.id}`)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edytuj CV
                        </button>
                        <button 
                          onClick={() => handleDelete(cv.id)} 
                          className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
