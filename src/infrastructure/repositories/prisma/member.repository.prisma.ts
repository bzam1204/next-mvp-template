import type { Member as PrismaMember, MemberClassification as PrismaMemberClassification } from "@prisma/client";

import { Member } from "@/domain/entities/member/member.entity";
import type MemberRepository from "@/domain/repositories/member.repository";
import type { PrismaClientLike } from "@/infrastructure/prisma/types";

import type { MemberSnapshot } from "@/domain/entities/member/member.entity";

const toDomainClassification = (classification: PrismaMemberClassification): MemberSnapshot["classification"] => {
  if (classification === "communicant") return "communicant";
  return "non-communicant";
};

const toPrismaClassification = (classification: MemberSnapshot["classification"]): PrismaMemberClassification => {
  if (classification === "communicant") return "communicant";
  return "nonCommunicant";
};

const nullable = (value?: string | null): string | null => (value ?? null);

export default class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly getClient: () => PrismaClientLike) {}

  private get prisma(): PrismaClientLike {
    return this.getClient();
  }

  public async findById(memberId: string): Promise<Member | null> {
    const record = await this.prisma.member.findUnique({
      where: { memberId },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  public async save(member: Member): Promise<Member> {
    const snapshot = member.toSnapshot();

    await this.prisma.member.upsert({
      where: { memberId: snapshot.memberId },
      create: this.mapToCreate(snapshot),
      update: this.mapToUpdate(snapshot),
    });

    return member;
  }

  public async delete(memberId: string): Promise<void> {
    await this.prisma.member.delete({ where: { memberId } });
  }

  private mapToDomain(record: PrismaMember): Member {
    return Member.rehydrate({
      memberId: record.memberId,
      fullName: record.fullName,
      email: nullable(record.email),
      phone: nullable(record.phone),
      cpf: nullable(record.cpf),
      classification: toDomainClassification(record.classification),
      status: record.status,
      sex: record.sex,
      maritalStatus: record.maritalStatus,
      birthDate: record.birthDate,
      placeOfBirth: record.placeOfBirth,
      literacy: record.literacy,
      profession: record.profession,
      religiousBackground: record.religiousBackground,
      baptizedInInfancy: record.baptizedInInfancy,
      reception: {
        date: record.receptionDate,
        mode: record.receptionMode,
        location: record.receptionLocation,
      },
      celebrant: record.celebrant,
      address: {
        street: record.addressStreet,
        number: record.addressNumber ?? undefined,
        district: record.addressDistrict ?? undefined,
        city: record.addressCity,
        state: record.addressState ?? undefined,
        zip: record.addressZip ?? undefined,
        complement: record.addressComplement ?? undefined,
      },
      createdAt: record.createdAt,
    });
  }

  private mapToCreate(snapshot: MemberSnapshot) {
    return {
      memberId: snapshot.memberId,
      fullName: snapshot.fullName,
      email: nullable(snapshot.email),
      phone: nullable(snapshot.phone),
      cpf: nullable(snapshot.cpf),
      profile: null,
      classification: toPrismaClassification(snapshot.classification),
      status: snapshot.status,
      sex: snapshot.sex,
      maritalStatus: snapshot.maritalStatus,
      birthDate: snapshot.birthDate,
      placeOfBirth: snapshot.placeOfBirth,
      literacy: snapshot.literacy,
      profession: snapshot.profession,
      religiousBackground: snapshot.religiousBackground,
      baptizedInInfancy: snapshot.baptizedInInfancy,
      receptionDate: snapshot.reception.date,
      receptionMode: snapshot.reception.mode,
      receptionLocation: snapshot.reception.location,
      celebrant: snapshot.celebrant,
      addressStreet: snapshot.address.street,
      addressNumber: nullable(snapshot.address.number),
      addressDistrict: nullable(snapshot.address.district),
      addressCity: snapshot.address.city,
      addressState: nullable(snapshot.address.state),
      addressZip: nullable(snapshot.address.zip),
      addressComplement: nullable(snapshot.address.complement),
      createdAt: snapshot.createdAt,
    };
  }

  private mapToUpdate(snapshot: MemberSnapshot) {
    return {
      fullName: snapshot.fullName,
      email: nullable(snapshot.email),
      phone: nullable(snapshot.phone),
      cpf: nullable(snapshot.cpf),
      classification: toPrismaClassification(snapshot.classification),
      status: snapshot.status,
      sex: snapshot.sex,
      maritalStatus: snapshot.maritalStatus,
      birthDate: snapshot.birthDate,
      placeOfBirth: snapshot.placeOfBirth,
      literacy: snapshot.literacy,
      profession: snapshot.profession,
      religiousBackground: snapshot.religiousBackground,
      baptizedInInfancy: snapshot.baptizedInInfancy,
      receptionDate: snapshot.reception.date,
      receptionMode: snapshot.reception.mode,
      receptionLocation: snapshot.reception.location,
      celebrant: snapshot.celebrant,
      addressStreet: snapshot.address.street,
      addressNumber: nullable(snapshot.address.number),
      addressDistrict: nullable(snapshot.address.district),
      addressCity: snapshot.address.city,
      addressState: nullable(snapshot.address.state),
      addressZip: nullable(snapshot.address.zip),
      addressComplement: nullable(snapshot.address.complement),
    };
  }
}
