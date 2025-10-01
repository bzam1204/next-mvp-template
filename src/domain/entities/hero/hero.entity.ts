import DomainEvent from "@/domain/events/domain.event";
import HeroCreated from "@/domain/events/hero/hero-created.event";
import HeroRenamed from "@/domain/events/hero/hero-renamed.event";
import HeroLeveledUp from "@/domain/events/hero/hero-leveled-up.event";

import { HeroErrorCodes } from "@/shared/error-codes/hero.error-codes";

export class Hero {
    private readonly _heroId: string;
    private readonly _createdAt: Date;
    private _name: string;
    private _power: number;
    private _alive: boolean;
    private _events: DomainEvent[] = [];

    private constructor(snapshot: HeroSnapshot) {
        this._heroId = snapshot.heroId;
        this._name = snapshot.name;
        this._power = snapshot.power;
        this._alive = snapshot.alive;
        this._createdAt = snapshot.createdAt;
    }

    public static create(props: HeroCreateProps): Hero {
        const name = Hero.assertValidName(props.name);
        const hero = new Hero({
            heroId: props.heroId,
            name,
            power: 1,
            alive: true,
            createdAt: new Date(),
        });
        const event = HeroCreated.create({ heroId: hero._heroId, name: hero._name })
        hero.emit(event);
        return hero;
    }

    public static rehydrate(snapshot: HeroSnapshot): Hero {
        const hero = new Hero(snapshot);
        return hero;
    }

    public static sanitizeName(name: string): string {
        const sanitized = (name ?? "").trim();
        return sanitized;
    }

    public static isValidName(name: string): boolean {
        const validation = Hero.sanitizeName(name).length >= 2;
        return validation;
    }

    private static assertValidName(name: string): string {
        const sanitized = Hero.sanitizeName(name);
        if (!Hero.isValidName(sanitized)) throw new Error(HeroErrorCodes.INVALID_NAME);
        return sanitized;
    }

    public rename(newName: string): void {
        const sanitized = Hero.assertValidName(newName);
        if (sanitized === this._name) return;
        this._name = sanitized;
        const event =  HeroRenamed.create({ heroId: this._heroId, newName: sanitized });
        this.emit(event);
    }

    public levelUp(): void {
        this._power += 1;
        const event = HeroLeveledUp.create({ heroId: this._heroId, newPower: this._power })
        this.emit(event);
    }

    public toSnapshot(): HeroSnapshot {
        const snapshot = {
            heroId: this._heroId,
            name: this._name,
            power: this._power,
            alive: this._alive,
            createdAt: this._createdAt,
        };
        return snapshot;
    }

    private emit(event: DomainEvent): void {
        this._events.push(event);
    }

    public pullEvents(): DomainEvent[] {
        const out = [...this._events];
        this._events = [];
        return out;
    }

    public get id(): string {
        return this._heroId;
    }

    public get name(): string {
        return this._name;
    }

    public get power(): number {
        return this._power;
    }

    public get alive(): boolean {
        return this._alive;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }
}

export interface HeroSnapshot {
    heroId: string;
    name: string;
    power: number;
    alive: boolean;
    createdAt: Date;
}

export interface HeroCreateProps {
    heroId: string;
    name: string;
}
