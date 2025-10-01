import DomainEvent from "@/domain/events/domain.event";

export interface MemberRestoredPayload {
  memberId: string;
}

export default class MemberRestored extends DomainEvent<MemberRestoredPayload> {
  public static readonly eventName = "MemberRestored";

  private constructor(payload: MemberRestoredPayload) {
    super({ payload });
  }

  public static create(payload: MemberRestoredPayload): MemberRestored {
    return new MemberRestored(payload);
  }

  public get name(): string {
    return MemberRestored.eventName;
  }
}

