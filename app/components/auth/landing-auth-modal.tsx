"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import LoginForm from "@/app/components/auth/login-form";
import SignupForm from "@/app/components/auth/signup-form";
import type { PublicSignupRole } from "@/lib/auth/roles";

type AuthMode = "login" | "signup";
type DialogState = { mode: AuthMode; signupRole: PublicSignupRole } | null;

type AuthDialogContextValue = {
  openAuth: (mode: AuthMode, signupRole?: PublicSignupRole) => void;
};

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialogState && !dialog.open) {
      dialog.showModal();
    } else if (!dialogState && dialog.open) {
      dialog.close();
    }
  }, [dialogState]);

  const openAuth = (mode: AuthMode, signupRole: PublicSignupRole = "player") => {
    setDialogState({ mode, signupRole });
  };

  const closeAuth = () => setDialogState(null);

  return (
    <AuthDialogContext.Provider value={{ openAuth }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={dialogState?.mode === "signup" ? "Create a CourtFinder account" : "Sign in to CourtFinder"}
        className="auth-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border-0 bg-white p-0 text-zinc-900 shadow-2xl"
        onCancel={(event) => {
          event.preventDefault();
          closeAuth();
        }}
        onClose={closeAuth}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeAuth();
        }}
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            aria-label="Close dialog"
            onClick={closeAuth}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            ×
          </button>

          {dialogState?.mode === "signup" ? (
            <SignupForm
              key={`signup-${dialogState.signupRole}`}
              initialRole={dialogState.signupRole}
              onSwitchToLogin={() => openAuth("login")}
            />
          ) : (
            <LoginForm onSwitchToSignup={() => openAuth("signup")} />
          )}
        </div>
      </dialog>
    </AuthDialogContext.Provider>
  );
}

export function AuthModalTrigger({
  mode,
  signupRole = "player",
  className,
  children,
}: {
  mode: AuthMode;
  signupRole?: PublicSignupRole;
  className?: string;
  children: ReactNode;
}) {
  const context = useContext(AuthDialogContext);

  if (!context) {
    throw new Error("AuthModalTrigger must be used within AuthModalProvider.");
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        const menu = event.currentTarget.closest("details");
        if (menu) menu.open = false;
        context.openAuth(mode, signupRole);
      }}
      className={className}
    >
      {children}
    </button>
  );
}