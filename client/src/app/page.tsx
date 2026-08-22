import { authService } from "@/features/auth/services/auth.service";

export default async function Home() {
  const user = await authService.getCurrentUser();

  return (
    <main>
      <h1>
        {user.firstName} {user.lastName}
      </h1>

      <p>{user.email}</p>
    </main>
  );
}