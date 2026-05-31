import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getOwnProfile, upsertProfile } from '../api/profile';
import { getMe, updateMe } from '../api/user';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getOwnProfile,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: getMe,
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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const [profileRes, userRes] = await Promise.all([
        upsertProfile({
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          city: data.city,
          country: data.country,
          linkedinUrl: data.linkedinUrl,
        }),
        updateMe({
          firstName: data.firstName,
          lastName: data.lastName,
        })
      ]);
      return { profileRes, userRes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
      queryClient.invalidateQueries({ queryKey: ['cv-full'] }); // invalidate to update preview header
      alert('Profil zaktualizowany pomyślnie!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ firstName, lastName, phone, avatarUrl, city, country, linkedinUrl });
  };

  if (isProfileLoading || isUserLoading) return <div className="py-20 text-center text-slate-500">Ładowanie profilu...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Wróć do Dashboardu
      </Link>
      
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Mój Profil</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imię</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nazwisko</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="block w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

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
    </div>
  );
}
