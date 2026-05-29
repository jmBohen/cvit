import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCvList, createCv, deleteCv } from '../api/cv';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newCvName, setNewCvName] = useState('');
  const [targetCompany, setTargetCompany] = useState('');

  const { data: cvs, isLoading, error } = useQuery({
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

  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div style={{ color: 'red' }}>Wystąpił błąd podczas pobierania CV</div>;

  return (
    <div>
      <h2>Dashboard - Twoje CV</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Utwórz nowe CV</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Nazwa CV (np. Backend Dev)"
            value={newCvName}
            onChange={(e) => setNewCvName(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
            required
          />
          <input
            type="text"
            placeholder="Firma docelowa (opcjonalnie)"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Tworzenie...' : 'Utwórz CV'}
          </button>
        </form>
      </div>

      <div>
        {cvs?.length === 0 ? (
          <p>Nie masz jeszcze żadnego CV. Utwórz pierwsze!</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {cvs?.map((cv) => (
              <div key={cv.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', width: '300px' }}>
                <h4>{cv.name}</h4>
                {cv.targetCompany && <p>Firma: {cv.targetCompany}</p>}
                <p>Data: {new Date(cv.createdAt).toLocaleDateString()}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => navigate(`/cv/${cv.id}`)}>Edytuj</button>
                  <button onClick={() => handleDelete(cv.id)} style={{ color: 'red' }}>Usuń</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
