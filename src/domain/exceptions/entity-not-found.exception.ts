import { DomainException } from "./domain.exception";

export class EntityNotFoundException extends DomainException {
    constructor(entity: string, id: string) {
        super(`${entity} not found: ${id}`);
        this.name = "EntityNotFoundException";
    }
}
