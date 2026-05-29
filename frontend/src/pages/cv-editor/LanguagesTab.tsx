import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Language } from '../../types/api';

function AddLanguageForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('B2');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('language', data),
    onSuccess: () => {
      setName('');
      setLevel('B2');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ name, level }); 
    }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <h4>Dodaj język</h4>
      <input type="text" placeholder="Język (np. Angielski)" value={name} onChange={e => setName(e.target.value)} required />
      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="C1">C1</option>
        <option value="C2">C2</option>
        <option value="native">Native</option>
      </select>
      <button type="submit">Dodaj</button>
    </form>
  );
}

export default function LanguagesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allLanguages } = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: () => getDataItems('language'),
  });

  const { data: cvLanguages } = useQuery<any[]>({
    queryKey: ['cv-languages', cvId],
    queryFn: () => getCvItems(cvId, 'language'),
  });

  const cvLangIds = new Set(cvLanguages?.map((l) => l.language.id));

  const mutation = useMutation({
    mutationFn: ({ langId, inCv }: { langId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'language', langId)
        : addItemToCv(cvId, 'language', langId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-languages', cvId] }),
  });

  return (
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moje języki</h3>
        <AddLanguageForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['languages'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allLanguages?.map((lang) => (
            <li key={lang.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={cvLangIds.has(lang.id)}
                  onChange={() => mutation.mutate({ langId: lang.id, inCv: cvLangIds.has(lang.id) })}
                  style={{ marginRight: '10px' }}
                />
                {lang.name} ({lang.level})
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvLanguages?.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>✓ {item.language.name}</strong> ({item.language.level})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
