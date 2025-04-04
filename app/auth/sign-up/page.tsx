// app/auth/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <SignUp
      path="/auth/sign-up"
      routing="path"
      signInUrl="/auth/sign-in"
      redirectUrl="/dashboard"
    />
  );
}