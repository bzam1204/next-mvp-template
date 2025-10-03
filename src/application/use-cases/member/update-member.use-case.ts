import type { UnitOfWork } from "@/domain/services/unit-of-work";
import { EntityNotFoundException } from "@/domain/exceptions/entity-not-found.exception";
import type MemberRepository from "@/domain/repositories/member.repository";
import type { UpdateMemberInput } from "@/application/dtos/member/update-member.input";
import type { MemberView } from "@/application/dtos/member/member.view";
import MemberMapper from "@/shared/mappers/member.mapper";

export class UpdateMemberUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly memberRepositoryFactory: () => MemberRepository,
  ) {}

  public async execute(input: UpdateMemberInput): Promise<MemberView> {
    const output = await this.unitOfWork.runInTransaction(async () => {
      const repo = this.memberRepositoryFactory();
      const member = await repo.findById(input.memberId);
      if (!member) {
        throw new EntityNotFoundException("Member", input.memberId);
      }
      member.update({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        cpf: input.cpf,
        sex: input.sex,
        address: input.address,
        literacy: input.literacy,
        birthDate: input.birthDate,
        reception: input.reception,
        celebrant: input.celebrant,
        professionOfFaithDate: input.professionOfFaithDate,
        placeOfBirth: input.placeOfBirth,
        maritalStatus: input.maritalStatus,
        baptizedInInfancy: input.baptizedInInfancy,
        religiousBackground: input.religiousBackground,
      });
      await repo.save(member);
      return { result: MemberMapper.toView(member), events: member.pullEvents() };
    });
    return output;
  }
}

export default UpdateMemberUseCase;
