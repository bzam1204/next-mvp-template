import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type MemberRepository from "@/domain/repositories/member.repository";
import { EntityNotFoundException } from "@/domain/exceptions/entity-not-found.exception";
import type { MemberClassification } from "@/domain/entities/member/member.entity";

import type { MemberView } from "@/application/dtos/member/member.view";

import MemberMapper from "@/shared/mappers/member.mapper";

export default class ChangeMemberClassificationUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly memberRepositoryFactory: () => MemberRepository,
  ) {}

  public async execute(input: { memberId: string; classification: MemberClassification }): Promise<MemberView> {
    const transactionOutput = await this.unitOfWork.runInTransaction(async () => {
      const repo = this.memberRepositoryFactory();
      const member = await repo.findById(input.memberId);
      if (!member) throw new EntityNotFoundException("Member", input.memberId);
      member.changeClassification(input.classification);
      await repo.save(member);
      return { result: MemberMapper.toView(member), events: member.pullEvents() };
    });
    return transactionOutput;
  }
}
