import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Certificate } from '../../types/api';

function AddCertificateForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('certificate', data),
    onSuccess: () => {
      setName('');
      setIssuer('');
      setIssueDate('');
      setCredentialUrl('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ name, issuer, issueDate, credentialUrl }); 
    }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <h4>Dodaj certyfikat</h4>
      <input type="text" placeholder="Nazwa certyfikatu" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Wystawca (np. AWS, Google)" value={issuer} onChange={e => setIssuer(e.target.value)} required />
      <input type="date" placeholder="Data wydania" value={issueDate} onChange={e => setIssueDate(e.target.value)} required />
      <input type="url" placeholder="URL do certyfikatu" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} />
      <button type="submit">Dodaj</button>
    </form>
  );
}

export default function CertificatesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allCertificates } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: () => getDataItems('certificate'),
  });

  const { data: cvCertificates } = useQuery<any[]>({
    queryKey: ['cv-certificates', cvId],
    queryFn: () => getCvItems(cvId, 'certificate'),
  });

  const cvCertIds = new Set(cvCertificates?.map((c) => c.certificate.id));

  const mutation = useMutation({
    mutationFn: ({ certId, inCv }: { certId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'certificate', certId)
        : addItemToCv(cvId, 'certificate', certId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-certificates', cvId] }),
  });

  return (
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moje certyfikaty</h3>
        <AddCertificateForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['certificates'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allCertificates?.map((cert) => (
            <li key={cert.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={cvCertIds.has(cert.id)}
                  onChange={() => mutation.mutate({ certId: cert.id, inCv: cvCertIds.has(cert.id) })}
                  style={{ marginRight: '10px' }}
                />
                {cert.name}
              </label>
              <div style={{ fontSize: '0.9em', marginLeft: '25px', color: '#666' }}>
                Wystawca: {cert.issuer} | {cert.issueDate}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvCertificates?.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>✓ {item.certificate.name}</strong><br/>
              {item.certificate.issuer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
