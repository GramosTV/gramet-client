'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useVerifyEmail } from '@/app/lib/hooks/useAuth';

enum State {
  PENDING,
  SUCCESS,
  ERROR,
}

const VerifyEmailPage = () => {
  const [state, setState] = useState(State.PENDING);
  const { token } = useParams();
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (typeof token === 'string' && token.length > 0) {
      verifyEmailMutation.mutate(token, {
        onSuccess: () => {
          setState(State.SUCCESS);
        },
        onError: () => {
          setState(State.ERROR);
        },
      });
    } else {
      setState(State.ERROR);
    }
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      <dialog id="my_modal_1" className="modal" open={state !== State.PENDING}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Email Verification</h3>
          <p className="py-4">
            {state === State.SUCCESS
              ? 'Email verified successfully!'
              : 'Email verification token is invalid or expired'}
          </p>
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
                <div className="flex space-x-4">
                  <Link href="/register" className="btn">
                    Register Again
                  </Link>
                  <Link href="/" className="btn">
                    Home
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default VerifyEmailPage;
