import DomainEvent from "@/domain/events/domain.event";

export interface MemberArchivedPayload {
  memberId: string;
}

export default class MemberArchived extends DomainEvent<MemberArchivedPayload> {
  public static readonly eventName = "MemberArchived";

  private constructor(payload: MemberArchivedPayload) {
    super({ payload });
  }

  public static create(payload: MemberArchivedPayload): MemberArchived {
    return new MemberArchived(payload);
  }

  public get name(): string {
    return MemberArchived.eventName;
  }
}
