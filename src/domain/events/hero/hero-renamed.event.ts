import DomainEvent from "../domain.event";

export interface HeroRenamedPayload {
    heroId: string;
    newName: string;
}

export default class HeroRenamed extends DomainEvent<HeroRenamedPayload> {
    public static readonly eventName = "HeroRenamed";

    private constructor(payload: HeroRenamedPayload) {
        super({ payload });
    }

    public static create(payload: HeroRenamedPayload): HeroRenamed {
        const event = new HeroRenamed(payload);
        return event;
    }

    public get name(): string {
        return HeroRenamed.eventName;
    }
}
