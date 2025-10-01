import DomainEvent from "@/domain/events/domain.event";
import MemberDeleted from "@/domain/events/member/member-deleted.event";
import MemberUpdated from "@/domain/events/member/member-updated.event";
import MemberArchived from "@/domain/events/member/member-archived.event";
import MemberRestored from "@/domain/events/member/member-restored.event";
import MemberRegistered from "@/domain/events/member/member-registered.event";
import InvalidOperationException from "@/domain/exceptions/invalid-operation.exception";
import MemberClassificationChanged from "@/domain/events/member/member-classification-changed.event";

import { MemberErrorCodes } from "@/shared/error-codes/member.error-codes";

export type MemberSex = 'male' | 'female';
export type MemberMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type MemberReceptionMode = 'profession_of_faith' | 'transfer' | 'restoration';
export type MemberClassification = 'communicant' | 'non-communicant';
export type MemberVisibilityStatus = 'active' | 'archived';

export interface MemberReception {
  date: Date;
  mode: MemberReceptionMode; // CI/IPB art.16: e.g., profession of faith, transfer, restoration
  location: string;
}

export interface MemberAddress {
  zip?: string;
  city: string;
  street: string;
  state?: string;
  number?: string;
  district?: string;
  complement?: string;
}

export interface MemberSnapshot {
  sex: MemberSex;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  status: MemberVisibilityStatus;
  address: MemberAddress;
  memberId: string;
  fullName: string;
  literacy: boolean; // can read/write
  createdAt: Date;
  birthDate: Date;
  celebrant: string;
  reception: MemberReception;
  profession: string;
  placeOfBirth: string;
  maritalStatus: MemberMaritalStatus;
  classification: MemberClassification;
  baptizedInInfancy: boolean;
  religiousBackground: string;
}

export interface MemberCreateProps {
  sex: MemberSex;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address: MemberAddress;
  memberId: string;
  fullName: string;
  literacy: boolean;
  birthDate: Date;
  celebrant: string;
  reception: MemberReception;
  profession: string;
  placeOfBirth: string;
  maritalStatus: MemberMaritalStatus;
  classification: MemberClassification;
  baptizedInInfancy: boolean;
  religiousBackground: string;
}

export interface MemberUpdateProps {
  sex?: MemberSex;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: MemberAddress;
  literacy?: boolean;
  fullName?: string;
  celebrant?: string;
  birthDate?: Date;
  reception?: MemberReception;
  profession?: string;
  placeOfBirth?: string;
  maritalStatus?: MemberMaritalStatus;
  baptizedInInfancy?: boolean;
  religiousBackground?: string;
}

export class Member {
  private readonly _memberId: string;
  private readonly _createdAt: Date;
  private _sex: MemberSex;
  private _cpf?: string | null;
  private _email?: string | null;
  private _phone?: string | null;
  private _status: MemberVisibilityStatus;
  private _events: DomainEvent[] = [];
  private _address: MemberAddress;
  private _fullName: string;
  private _literacy: boolean;
  private _reception: MemberReception;
  private _celebrant: string;
  private _birthDate: Date;
  private _profession: string;
  private _placeOfBirth: string;
  private _maritalStatus: MemberMaritalStatus;
  private _classification: MemberClassification;
  private _baptizedInInfancy: boolean;
  private _religiousBackground: string;

  private constructor(snapshot: MemberSnapshot) {
    this._sex = snapshot.sex;
    this._cpf = snapshot.cpf;
    this._email = snapshot.email;
    this._phone = snapshot.phone;
    this._status = snapshot.status;
    this._address = snapshot.address;
    this._literacy = snapshot.literacy;
    this._fullName = snapshot.fullName;
    this._memberId = snapshot.memberId;
    this._reception = snapshot.reception;
    this._celebrant = snapshot.celebrant;
    this._createdAt = snapshot.createdAt;
    this._birthDate = snapshot.birthDate;
    this._profession = snapshot.profession;
    this._placeOfBirth = snapshot.placeOfBirth;
    this._maritalStatus = snapshot.maritalStatus;
    this._classification = snapshot.classification;
    this._baptizedInInfancy = snapshot.baptizedInInfancy;
    this._religiousBackground = snapshot.religiousBackground;
  }

  public static create(props: MemberCreateProps): Member {
    const fullName = Member.assertValidFullName(props.fullName);
    const classification = Member.assertValidClassification(props.classification);
    const birthDate = Member.assertValidDate(props.birthDate, MemberErrorCodes.INVALID_BIRTH_DATE);
    // PRD R1.1 mandatory fields for communicant admission
    if (classification === 'communicant') {
      const required: Array<[string, unknown]> = [
        ['sex', props.sex],
        ['address', props.address],
        ['literacy', props.literacy],
        ['birthDate', birthDate],
        ['reception', props.reception],
        ['celebrant', props.celebrant],
        ['profession', props.profession],
        ['placeOfBirth', props.placeOfBirth],
        ['maritalStatus', props.maritalStatus],
        ['baptizedInInfancy', props.baptizedInInfancy],
        ['religiousBackground', props.religiousBackground],
      ];
      const missing = required.filter(([_, v]) => v === undefined || v === null || (typeof v === 'string' && v.trim().length === 0));
      if (missing.length > 0) throw new InvalidOperationException(MemberErrorCodes.MISSING_COMMUNICANT_REQUIRED_FIELDS);
      // Deep checks for nested required properties
      if (!props.address.city?.trim() || !props.address.street?.trim()) {
        throw new InvalidOperationException(MemberErrorCodes.MISSING_COMMUNICANT_REQUIRED_FIELDS);
      }
      Member.assertValidDate(props.reception.date, MemberErrorCodes.INVALID_RECEPTION_DATE);
    }

    const member = new Member({
      sex: props.sex,
      cpf: props.cpf ?? null,
      email: props.email ?? null,
      phone: props.phone ?? null,
      status: 'active',
      address: props.address,
      fullName,
      memberId: props.memberId,
      literacy: props.literacy,
      birthDate,
      reception: props.reception,
      celebrant: props.celebrant,
      createdAt: new Date(),
      profession: props.profession,
      placeOfBirth: props.placeOfBirth,
      maritalStatus: props.maritalStatus,
      classification,
      baptizedInInfancy: props.baptizedInInfancy,
      religiousBackground: props.religiousBackground,
    });

    member.emit(MemberRegistered.create({ memberId: member._memberId }));
    return member;
  }

  public static rehydrate(snapshot: MemberSnapshot): Member {
    return new Member(snapshot);
  }

  public static sanitizeFullName(name: string): string {
    return (name ?? '').trim();
  }

  public static isValidFullName(name: string): boolean {
    return Member.sanitizeFullName(name).length >= 2;
  }

  private static assertValidFullName(name: string): string {
    const sanitized = Member.sanitizeFullName(name);
    if (!Member.isValidFullName(sanitized)) throw new InvalidOperationException(MemberErrorCodes.INVALID_FULL_NAME);
    return sanitized;
  }

  private static assertValidClassification(c: string): MemberClassification {
    if (c === 'communicant' || c === 'non-communicant') return c;
    throw new InvalidOperationException(MemberErrorCodes.INVALID_CLASSIFICATION);
  }

  private static assertValidDate(d: Date, errorCode: string): Date {
    if (!d || Number.isNaN(d.getTime())) {
      throw new InvalidOperationException(errorCode);
    }
    return d;
  }

  public update(props: MemberUpdateProps): void {
    let changed = false;
    if (props.fullName !== undefined) {
      const val = Member.assertValidFullName(props.fullName);
      if (val !== this._fullName) { this._fullName = val; changed = true; }
    }
    if (props.email !== undefined && props.email !== this._email) { this._email = props.email; changed = true; }
    if (props.phone !== undefined && props.phone !== this._phone) { this._phone = props.phone; changed = true; }
    if (props.cpf !== undefined && props.cpf !== this._cpf) { this._cpf = props.cpf; changed = true; }
    if (props.birthDate !== undefined) {
      const bd = Member.assertValidDate(props.birthDate, MemberErrorCodes.INVALID_BIRTH_DATE);
      if (bd.getTime() !== this._birthDate.getTime()) { this._birthDate = bd; changed = true; }
    }
    if (props.placeOfBirth !== undefined && props.placeOfBirth !== this._placeOfBirth) { this._placeOfBirth = props.placeOfBirth; changed = true; }
    if (props.sex !== undefined && props.sex !== this._sex) { this._sex = props.sex; changed = true; }
    if (props.religiousBackground !== undefined && props.religiousBackground !== this._religiousBackground) { this._religiousBackground = props.religiousBackground; changed = true; }
    if (props.maritalStatus !== undefined && props.maritalStatus !== this._maritalStatus) { this._maritalStatus = props.maritalStatus; changed = true; }
    if (props.profession !== undefined && props.profession !== this._profession) { this._profession = props.profession; changed = true; }
    if (props.address !== undefined) { this._address = props.address; changed = true; }
    if (props.literacy !== undefined && props.literacy !== this._literacy) { this._literacy = props.literacy; changed = true; }
    if (props.baptizedInInfancy !== undefined && props.baptizedInInfancy !== this._baptizedInInfancy) { this._baptizedInInfancy = props.baptizedInInfancy; changed = true; }
    if (props.reception !== undefined) {
      Member.assertValidDate(props.reception.date, MemberErrorCodes.INVALID_RECEPTION_DATE);
      this._reception = props.reception; changed = true;
    }
    if (props.celebrant !== undefined && props.celebrant !== this._celebrant) { this._celebrant = props.celebrant; changed = true; }
    if (changed) {
      this.emit(MemberUpdated.create({ memberId: this._memberId }));
    }
  }

  public changeClassification(newClassification: MemberClassification): void {
    const val = Member.assertValidClassification(newClassification);
    if (val === this._classification) return;
    this._classification = val;
    this.emit(MemberClassificationChanged.create({ memberId: this._memberId, newClassification: val }));
  }

  public archive(): void {
    if (this._status === 'archived') return;
    this._status = 'archived';
    this.emit(MemberArchived.create({ memberId: this._memberId }));
  }

  public restore(): void {
    if (this._status === 'active') return;
    this._status = 'active';
    this.emit(MemberRestored.create({ memberId: this._memberId }));
  }

  public delete(): void {
    // Note: hard delete is handled by repository; entity just emits intent
    this.emit(MemberDeleted.create({ memberId: this._memberId }));
  }

  public toSnapshot(): MemberSnapshot {
    return {
      sex: this._sex,
      cpf: this._cpf ?? null,
      email: this._email ?? null,
      phone: this._phone ?? null,
      status: this._status,
      address: this._address,
      fullName: this._fullName,
      memberId: this._memberId,
      literacy: this._literacy,
      birthDate: this._birthDate,
      reception: this._reception,
      celebrant: this._celebrant,
      createdAt: this._createdAt,
      profession: this._profession,
      placeOfBirth: this._placeOfBirth,
      maritalStatus: this._maritalStatus,
      classification: this._classification,
      baptizedInInfancy: this._baptizedInInfancy,
      religiousBackground: this._religiousBackground,
    };
  }

  private emit(event: DomainEvent): void {
    this._events.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const out = [...this._events];
    this._events = [];
    return out;
  }

  public get id(): string { return this._memberId; }
  public get cpf(): string | null | undefined { return this._cpf; }
  public get sex(): MemberSex { return this._sex; }
  public get email(): string | null | undefined { return this._email; }
  public get phone(): string | null | undefined { return this._phone; }
  public get status(): MemberVisibilityStatus { return this._status; }
  public get address(): MemberAddress { return this._address; }
  public get fullName(): string { return this._fullName; }
  public get literacy(): boolean { return this._literacy; }
  public get reception(): MemberReception { return this._reception; }
  public get celebrant(): string { return this._celebrant; }
  public get createdAt(): Date { return this._createdAt; }
  public get birthDate(): Date { return this._birthDate; }
  public get profession(): string { return this._profession; }
  public get placeOfBirth(): string { return this._placeOfBirth; }
  public get maritalStatus(): MemberMaritalStatus { return this._maritalStatus; }
  public get classification(): MemberClassification { return this._classification; }
  public get baptizedInInfancy(): boolean { return this._baptizedInInfancy; }
  public get religiousBackground(): string { return this._religiousBackground; }
}
