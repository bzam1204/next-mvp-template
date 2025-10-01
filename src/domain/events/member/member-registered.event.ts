import DomainEvent from "@/domain/events/domain.event";

export interface MemberRegisteredPayload {
  memberId: string;
}

export default class MemberRegistered extends DomainEvent<MemberRegisteredPayload> {
  public static readonly eventName = "MemberRegistered";

  private constructor(payload: MemberRegisteredPayload) {
    super({ payload });
  }

  public static create(payload: MemberRegisteredPayload): MemberRegistered {
    return new MemberRegistered(payload);
  }

  public get name(): string {
    return MemberRegistered.eventName;
  }
}

