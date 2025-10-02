import type { MemberView } from "@/application/dtos/member/member.view";

export interface GetMemberByIdQueryInput {
    memberId: string;
}

export default interface GetMemberByIdQuery {
    execute(input: GetMemberByIdQueryInput): Promise<MemberView | null>;
}
