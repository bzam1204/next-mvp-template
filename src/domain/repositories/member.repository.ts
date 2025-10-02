import { Member } from "@/domain/entities/member/member.entity";

export default interface MemberRepository {
  findById(memberId: string): Promise<Member | null>;
  save(member: Member): Promise<Member>;
  delete(memberId: string): Promise<void>;
}
