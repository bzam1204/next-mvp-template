import { DomainException } from "./domain.exception";

export default class InvalidOperationException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = "InvalidOperationException";
    }
}
