import { DomainException } from "./domain.exception";

export class InvalidOperationException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = "InvalidOperationException";
    }
}
