import type { MemberView } from "@/application/dtos/member/member.view";

export interface SearchMembersQueryInput {
    page: number;
    pageSize: number;
    name?: string;
    profile?: string;
    visibility?: "active" | "archived" | "all";
}

export interface SearchMembersQueryResult {
    items: MemberView[];
    total: number;
    page: number;
    pageSize: number;
}

export default interface SearchMembersQuery {
    execute(input: SearchMembersQueryInput): Promise<SearchMembersQueryResult>;
}
