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
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">Dodaj certyfikat</h4>
      
      <div>
        <label className="block text-xs text-slate-500 mb-1">Nazwa certyfikatu</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Wystawca (np. AWS, Microsoft)</label>
        <input type="text" value={issuer} onChange={e => setIssuer(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data wydania</label>
          <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">URL / Link do weryfikacji</label>
          <input type="url" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          Dodaj certyfikat
        </button>
      </div>
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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Zdobyte certyfikaty</h3>
        <AddCertificateForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['certificates'] })} />
        
        <div className="space-y-3">
          {allCertificates?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych certyfikatów.</p>}
          {allCertificates?.map((cert) => {
            const inCv = cvCertIds.has(cert.id);
            return (
              <label key={cert.id} className={`flex items-start p-4 rounded-md border cursor-pointer transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="checkbox"
                    checked={inCv}
                    onChange={() => mutation.mutate({ certId: cert.id, inCv })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                    {cert.name}
                  </span>
                  <span className="block text-sm text-slate-600 font-medium">
                    {cert.issuer}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">
                    Zdobyto: {cert.issueDate}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Wybrane do CV</h3>
        <ul className="space-y-3">
          {cvCertificates?.length === 0 && <p className="text-sm text-slate-500 italic">Zaznacz certyfikaty w lewej kolumnie.</p>}
          {cvCertificates?.map((item) => (
            <li key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-slate-200 flex items-center">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.certificate.name}</h4>
                <p className="text-xs text-slate-500">{item.certificate.issuer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
