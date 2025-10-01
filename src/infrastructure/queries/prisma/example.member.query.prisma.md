# Example Prisma Query (Member)

```ts
// Queries return Views and do not use domain entities.

export class PrismaMemberQuery {
  constructor(private readonly prisma: any) {}
  async searchMembers(params: { text?: string; page: number; size: number }) {
    // const where = { name: { contains: params.text, mode: 'insensitive' } }
    // const [items, total] = await this.prisma.$transaction([
    //   this.prisma.member.findMany({ where, skip: (params.page-1)*params.size, take: params.size }),
    //   this.prisma.member.count({ where })
    // ]);
    return { items: [], total: 0 };
  }
}
```
