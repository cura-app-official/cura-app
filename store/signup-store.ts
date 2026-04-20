import { createContext, useContext } from 'react';

export interface SignupData {
  username: string;
  birth_date: string;
  gender: string;
  email: string;
  password: string;
}

interface SignupContextType {
  data: Partial<SignupData>;
  setData: (updates: Partial<SignupData>) => void;
  reset: () => void;
}

export const SignupContext = createContext<SignupContextType>({
  data: {},
  setData: () => {},
  reset: () => {},
});

export function useSignup() {
  return useContext(SignupContext);
}
