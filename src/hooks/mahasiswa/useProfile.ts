import { useState, useEffect } from 'react';
import { MahasiswaProfile } from '../../types/mahasiswa.types';
import { getMahasiswaProfile } from '../../api/mahasiswa/profileService';

export const useMahasiswaProfile = (id: string | null) => {
    const [profile, setProfile] = useState<MahasiswaProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if the ID is available
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getMahasiswaProfile(id);
                setProfile(data);
            } catch (err) {
                setError('Gagal memuat data profil. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]); // This hook will re-run if the user ID changes

    return { profile, loading, error };
};