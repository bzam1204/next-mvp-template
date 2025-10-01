import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type MemberRepository from "@/domain/repositories/member.repository";
import InvalidOperationException from "@/domain/exceptions/invalid-operation.exception";
import { EntityNotFoundException } from "@/domain/exceptions/entity-not-found.exception";

import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

export default class DeleteMemberPermanentlyUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly memberRepositoryFactory: () => MemberRepository,
  ) {}

  public async execute(input: { memberId: string; confirm: string }): Promise<void> {
    const expected = `DELETE ${input.memberId}`;
    if (input.confirm !== expected) {
      throw new InvalidOperationException(MemberErrorCodes.INVALID_DELETE_CONFIRMATION);
    }

    await this.unitOfWork.runInTransaction(async () => {
      const repo = this.memberRepositoryFactory();
      const member = await repo.findById(input.memberId);
      if (!member) throw new EntityNotFoundException("Member", input.memberId);
      member.delete();
      await repo.delete(input.memberId);
      return { result: undefined as void, events: member.pullEvents() };
    });
  }
}
