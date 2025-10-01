import DomainEvent from "@/domain/events/domain.event";

export interface MemberUpdatedPayload {
  memberId: string;
}

export default class MemberUpdated extends DomainEvent<MemberUpdatedPayload> {
  public static readonly eventName = "MemberUpdated";

  private constructor(payload: MemberUpdatedPayload) {
    super({ payload });
  }

  public static create(payload: MemberUpdatedPayload): MemberUpdated {
    return new MemberUpdated(payload);
  }

  public get name(): string {
    return MemberUpdated.eventName;
  }
}

