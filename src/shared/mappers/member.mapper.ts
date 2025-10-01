import { Member } from "@/domain/entities/member/member.entity";
import type { MemberView } from "@/application/dtos/member/member.view";

export default class MemberMapper {
  public static toView(member: Member): MemberView {
    const s = member.toSnapshot();
    return {
      id: s.memberId,
      fullName: s.fullName,
      email: s.email ?? null,
      phone: s.phone ?? null,
      cpf: s.cpf ?? null,
      classification: s.classification,
      status: s.status,
      sex: s.sex,
      maritalStatus: s.maritalStatus,
      address: {
        street: s.address.street,
        number: s.address.number,
        district: s.address.district,
        city: s.address.city,
        state: s.address.state,
        zip: s.address.zip,
        complement: s.address.complement,
      },
      birthDate: s.birthDate.toISOString(),
      createdAt: s.createdAt.toISOString(),
      reception: {
        date: s.reception.date.toISOString(),
        mode: s.reception.mode,
        location: s.reception.location,
      },
      celebrant: s.celebrant,
      profession: s.profession,
      placeOfBirth: s.placeOfBirth,
      baptizedInInfancy: s.baptizedInInfancy,
      religiousBackground: s.religiousBackground,
    };
  }
}

