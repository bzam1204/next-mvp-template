import DomainEvent from "@/domain/events/domain.event";

export interface MemberDeletedPayload {
  memberId: string;
}

export default class MemberDeleted extends DomainEvent<MemberDeletedPayload> {
  public static readonly eventName = "MemberDeleted";

  private constructor(payload: MemberDeletedPayload) {
    super({ payload });
  }

  public static create(payload: MemberDeletedPayload): MemberDeleted {
    return new MemberDeleted(payload);
  }

  public get name(): string {
    return MemberDeleted.eventName;
  }
}

