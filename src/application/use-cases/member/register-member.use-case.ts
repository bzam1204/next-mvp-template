import { Member } from "@/domain/entities/member/member.entity";
import type { UnitOfWork } from "@/domain/services/unit-of-work";
import type IdGenerator from "@/application/services/id-generator.service";
import type MemberRepository from "@/domain/repositories/member.repository";

import type { CreateMemberInput } from "@/application/dtos/member/create-member.input";
import type { MemberView } from "@/application/dtos/member/member.view";
import MemberMapper from "@/shared/mappers/member.mapper";

export class RegisterMemberUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly idGenerator: IdGenerator,
    private readonly memberRepositoryFactory: () => MemberRepository,
  ) {}

  public async execute(input: CreateMemberInput): Promise<MemberView> {
    const output = await this.unitOfWork.runInTransaction(async () => {
      const member = Member.create({
        sex: input.sex,
        memberId: this.idGenerator.generate(),
        fullName: input.fullName,
        email: input.email ?? null,
        phone: input.phone ?? null,
        cpf: input.cpf ?? null,
        address: input.address,
        literacy: input.literacy,
        birthDate: input.birthDate,
        reception: input.reception,
        celebrant: input.celebrant,
        profession: input.profession,
        placeOfBirth: input.placeOfBirth,
        maritalStatus: input.maritalStatus,
        classification: input.classification,
        baptizedInInfancy: input.baptizedInInfancy,
        religiousBackground: input.religiousBackground,
      });

      const repo = this.memberRepositoryFactory();
      await repo.save(member);
      const events = member.pullEvents();
      return { result: MemberMapper.toView(member), events };
    });
    return output;
  }
}

export default RegisterMemberUseCase;

