import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type MemberRepository from "@/domain/repositories/member.repository";
import { EntityNotFoundException } from "@/domain/exceptions/entity-not-found.exception";

export class RestoreMemberUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly memberRepositoryFactory: () => MemberRepository,
  ) {}

  public async execute(input: { memberId: string }): Promise<void> {
    await this.unitOfWork.runInTransaction(async () => {
      const repo = this.memberRepositoryFactory();
      const member = await repo.findById(input.memberId);
      if (!member) {
        throw new EntityNotFoundException("Member", input.memberId);
      }
      member.restore();
      await repo.save(member);
      return { result: undefined as void, events: member.pullEvents() };
    });
  }
}

export default RestoreMemberUseCase;
