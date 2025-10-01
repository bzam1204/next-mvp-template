import DomainEvent from "@/domain/events/domain.event";

export interface MemberClassificationChangedPayload {
  memberId: string;
  newClassification: 'communicant' | 'non-communicant';
}

export default class MemberClassificationChanged extends DomainEvent<MemberClassificationChangedPayload> {
  public static readonly eventName = "MemberClassificationChanged";

  private constructor(payload: MemberClassificationChangedPayload) {
    super({ payload });
  }

  public static create(payload: MemberClassificationChangedPayload): MemberClassificationChanged {
    return new MemberClassificationChanged(payload);
  }

  public get name(): string {
    return MemberClassificationChanged.eventName;
  }
}

