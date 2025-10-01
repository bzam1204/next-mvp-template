# Example Auth (PoC Minimal)

```ts
// PoC: simple username/password and roles; no token/session
export type Role = 'ADMIN'|'SECRETARY'|'TREASURY';
export type User = { id: string; name: string; roles: Role[] };

export async function login(username: string, password: string): Promise<User | null> {
  // replace with real verification
  if (username === 'admin' && password === 'admin') return { id: '1', name: 'Admin', roles: ['ADMIN'] };
  return null;
}
```
