import { randomUUID } from "crypto";

import type IdGenerator from "@/application/services/id-generator.service";

export default class UuidIdGenerator implements IdGenerator {
    public generate(): string {
        const uuid = randomUUID();
        return uuid;
    }
}
