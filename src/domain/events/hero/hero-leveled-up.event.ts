import DomainEvent from "../domain.event";

export interface HeroLeveledUpPayload {
    heroId: string;
    newPower: number;
}

export default class HeroLeveledUp extends DomainEvent<HeroLeveledUpPayload> {
    public static readonly eventName = "HeroLeveledUp";

    private constructor(payload: HeroLeveledUpPayload) {
        super({ payload });
    }

    public static create(payload: HeroLeveledUpPayload): HeroLeveledUp {
        const event = new HeroLeveledUp(payload);
        return event;
    }

    public get name(): string {
        return HeroLeveledUp.eventName;
    }
}
