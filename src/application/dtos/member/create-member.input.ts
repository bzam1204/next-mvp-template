import type {
  MemberSex,
  MemberAddress,
  MemberReception,
  MemberMaritalStatus,
  MemberClassification,
} from "@/domain/entities/member/member.entity";

export interface CreateMemberInput {
  sex: MemberSex;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address: MemberAddress;
  fullName: string;
  literacy: boolean;
  birthDate: Date;
  reception: MemberReception;
  celebrant: string;
  professionOfFaithDate: Date;
  placeOfBirth: string;
  maritalStatus: MemberMaritalStatus;
  classification: MemberClassification;
  baptizedInInfancy: boolean;
  religiousBackground: string;
}
