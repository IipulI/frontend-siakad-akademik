import { useState, useEffect } from 'react';

// Define the shape of the object in localStorage
interface AccountInfo {
    id: string;
    nama: string;
    code: string;
}

export const useAccountInfo = (): AccountInfo | null => {
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

    useEffect(() => {
        // Get the JSON string from localStorage
        const item = localStorage.getItem('account_info');

        if (item) {
            try {
                // Parse the JSON string and set the state
                setAccountInfo(JSON.parse(item));
            } catch (error) {
                console.error("Failed to parse account_info from localStorage", error);
                setAccountInfo(null);
            }
        }
    }, []); // The empty array means this effect runs only once when the component mounts

    return accountInfo;
};