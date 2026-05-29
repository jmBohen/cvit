import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Technology } from '../../types/api';

function AddTechnologyForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [category, setCategory] = useState('');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('technology', data),
    onSuccess: () => {
      setName('');
      setCategory('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ name, level, category }); }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc' }}>
      <h4>Dodaj nową technologię</h4>
      <input type="text" placeholder="Nazwa" value={name} onChange={e => setName(e.target.value)} required />
      <select value={level} onChange={e => setLevel(e.target.value)} style={{ marginLeft: '10px' }}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="expert">Expert</option>
      </select>
      <input type="text" placeholder="Kategoria (np. Frontend)" value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: '10px' }} />
      <button type="submit" style={{ marginLeft: '10px' }}>Dodaj</button>
    </form>
  );
}

export default function TechnologiesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allTechnologies } = useQuery<Technology[]>({
    queryKey: ['technologies'],
    queryFn: () => getDataItems('technology'),
  });

  const { data: cvTechnologies } = useQuery<any[]>({
    queryKey: ['cv-technologies', cvId],
    queryFn: () => getCvItems(cvId, 'technology'),
  });

  const cvTechIds = new Set(cvTechnologies?.map((t) => t.technology.id));

  const mutation = useMutation({
    mutationFn: ({ techId, inCv }: { techId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'technology', techId)
        : addItemToCv(cvId, 'technology', techId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-technologies', cvId] }),
  });

  return (
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moje dane</h3>
        <AddTechnologyForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['technologies'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allTechnologies?.map((tech) => (
            <li key={tech.id} style={{ marginBottom: '5px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={cvTechIds.has(tech.id)}
                  onChange={() => mutation.mutate({ techId: tech.id, inCv: cvTechIds.has(tech.id) })}
                />
                {tech.name} ({tech.level}) {tech.category && `- ${tech.category}`}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvTechnologies?.map((item) => (
            <li key={item.id} style={{ marginBottom: '5px' }}>✓ {item.technology.name} ({item.technology.level})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
