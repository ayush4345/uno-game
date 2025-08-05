'use client';

import ProfilePage from '@/components/profile/ProfilePage';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAccountState } from '@/userstate/userState';

export default function Profile() {
  const [userAccount, setUserAccount] = useRecoilState(userAccountState);
  const [isLoading, setIsLoading] = useState(false);

  // OnchainKit handles wallet connection through its components
  // This function is kept for compatibility with ProfilePage component
  async function connectWallet() {
    try {
      setIsLoading(true);
      // With OnchainKit, we don't need to manually connect
      // This is just a placeholder for the ProfilePage component
      return null;
    } catch (error) {
      console.error(`Error: ${error}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Check if user account exists in localStorage
    const storedPublicKey = localStorage.getItem('publicKey');
    if (storedPublicKey && !userAccount) {
      setUserAccount(storedPublicKey);
    }
  }, [userAccount, setUserAccount]);

  return (
    <main className="bg-cover bg-[url('/bg-2.jpg')] min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <ProfilePage userAccount={userAccount} connectWallet={connectWallet} isLoading={isLoading} />
      </div>
    </main>
  );
}
