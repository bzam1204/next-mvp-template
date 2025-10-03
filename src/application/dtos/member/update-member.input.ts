import type {
  MemberSex,
  MemberAddress,
  MemberReception,
  MemberMaritalStatus,
} from "@/domain/entities/member/member.entity";

export interface UpdateMemberInput {
  cpf?: string | null;
  sex?: MemberSex;
  email?: string | null;
  phone?: string | null;
  memberId: string;
  fullName?: string;
  address?: MemberAddress;
  literacy?: boolean;
  birthDate?: Date;
  reception?: MemberReception;
  celebrant?: string;
  professionOfFaithDate?: Date;
  placeOfBirth?: string;
  maritalStatus?: MemberMaritalStatus;
  baptizedInInfancy?: boolean;
  religiousBackground?: string;
}
