import { EmailErrorCodes } from "@/shared/error-codes/email.error-codes";

import { InvalidOperationException } from "../exceptions/invalid-operation.exception";

export class Email {
    public static readonly regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    private constructor(private readonly value: string) {}

    public static create(rawEmail: string) {
        if (!this.isValidRawEmail(rawEmail))
            throw new InvalidOperationException(EmailErrorCodes.INVALID_RAW);
        const instance = new Email(rawEmail.toLowerCase());
        return instance;
    }

    public toString(): string {
        const parsedEmail = this.value;
        return parsedEmail;
    }

    public equals(other: Email): boolean {
        const comparison = other.value === this.value;
        return comparison;
    }

    private static isValidRawEmail(rawEmail: string): boolean {
        const validation = this.regex.test(rawEmail);
        return validation;
    }
}
