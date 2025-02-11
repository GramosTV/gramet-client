'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useParams } from 'next/navigation';

enum State {
  PENDING,
  SUCCESS,
  ERROR,
}
const page = () => {
  const [state, setState] = useState(State.PENDING);
  const { token } = useParams();
  const mutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await fetchWithAuth(`/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    },
    onSuccess: (res) => {
      setState(State.SUCCESS);
    },
    onError: (error) => {
      setState(State.ERROR);
    },
  });
  useEffect(() => {
    if (typeof token === 'string' && token.length > 0) {
      mutation.mutate(token);
    }
  }, []);
  return (
    <>
      <div className="min-h-[calc(100vh-var(--header-height))]">
        <dialog id="my_modal_1" className="modal" open={state !== State.PENDING}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            {state === State.SUCCESS ? 'Email verified succesfuly!' : 'Email verification token is inavlid or expired'}
            <p className="py-4"></p>
            <div className="modal-action">
              <form method="dialog">
                {state === State.SUCCESS ? (
                  <div className="flex space-x-4">
                    <Link href="/login" className="btn">
                      Log in
                    </Link>
                    <Link href="/" className="btn">
                      Home
                    </Link>
                  </div>
                ) : (
                  <Link href="/" className="btn">
                    Home
                  </Link>
                )}
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default page;
