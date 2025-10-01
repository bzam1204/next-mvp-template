import DomainEvent from "../domain.event";

export interface HeroCreatedPayload {
    heroId: string;
    name: string;
}

export default class HeroCreated extends DomainEvent<HeroCreatedPayload> {
    public static readonly eventName = "HeroCreated";

    private constructor(payload: HeroCreatedPayload) {
        super({ payload });
    }

    public static create(payload: HeroCreatedPayload): HeroCreated {
        const event = new HeroCreated(payload);
        return event;
    }

    public get name(): string {
        return HeroCreated.eventName;
    }
}
