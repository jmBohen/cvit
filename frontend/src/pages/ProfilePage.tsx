import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOwnProfile, upsertProfile } from '../api/profile';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getOwnProfile,
  });

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatarUrl || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setLinkedinUrl(profile.linkedinUrl || '');
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Profil zaktualizowany pomyślnie!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ phone, avatarUrl, city, country, linkedinUrl });
  };

  if (isLoading) return <div className="py-20 text-center text-slate-500">Ładowanie profilu...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-sm border border-slate-200 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Mój Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Numer telefonu</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Miasto</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">URL Zdjęcia profilowego (Avatar)</label>
          <input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          {avatarUrl && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Podgląd zdjęcia:</p>
              <img src={avatarUrl} alt="Avatar Preview" className="h-20 w-20 object-cover rounded-full border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kraj</label>
            <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
            <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="inline-flex justify-center items-center px-6 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {mutation.isPending ? 'Zapisywanie...' : 'Zapisz profil'}
          </button>
        </div>
      </form>
    </div>
  );
}
