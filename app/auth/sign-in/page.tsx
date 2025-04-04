// app/auth/sign-in/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn
      path="/auth/sign-in"
      routing="path"
      signUpUrl="/auth/sign-up"
      redirectUrl="/dashboard"
    />
  );
}