# Product Requirements Document (PRD) Template

## Overview

The Member Registration module enables church staff to create, update, archive, permanently delete, manage status, and search members in a structured and compliant way. It addresses the current reliance on spreadsheets by standardizing the collection of member data aligned with IPB vocabulary and the mandatory admission data for communicant members. Primary users are secretaria (church office). This feature increases data integrity, accelerates onboarding, and prepares the ground for future statistics and reporting.

## Goals

- Provide a clear and complete member registration flow aligned with IPB requirements.
- Enable reversible archival (soft delete) and permanent deletion with strong confirmation UX.
- Establish foundational structure compatible with admission/low (baixa) events and IPB-aligned reports.
- Avoid unnecessary React re-renders in the UI to keep interactions smooth.

## User Stories

- As secretaria, I register a new member by filling mandatory civil and ecclesiastical fields so records are reliable and compatible with IPB requirements.
- As secretaria, I update a member’s profile when their address, marital status, or profile changes so records remain current.
- As secretaria, I archive a member (reversible) when they are no longer active but must remain in historical listings.
- As secretaria, I permanently delete a record only in exceptional cases and with explicit confirmation.
- As secretaria, I change the membership classification (communicant/non‑communicant) and member lifecycle visibility (active/archived) to reflect reality and statistics.
- As secretaria, I search a paginated list of members filtered by name and profile (per docs) and navigate to a member detail page to take actions.

## Core Features

1) Member Creation (Create)
   - What: Create a new member profile with mandatory IPB fields and optional attributes.
   - Why: Ensures consistent, compliant data capture and reduces spreadsheet dependence.
   - How (high level): Client form posts to a Server Action controller; the application use case validates and persists via repository; returns a DTO.
   - Functional requirements:
     - R1.1 The system must capture required fields for communicant admission per docs/user.md: birth date and place, sex, religious background, marital status, profession, full address, literacy (can read/write), baptized in infancy (yes/no), reception (date, location, mode per CI/IPB art.16), and celebrant name.
     - R1.2 The system must capture core profile fields: full name, email (optional), phone (optional), national identifiers when available (e.g., CPF), and profile as defined in the source documents (docs).
     - R1.3 The system must capture membership classification at creation: communicant or non‑communicant.
     - R1.4 Required fields must be validated client-side and server-side with clear error messages.

2) Member Update (Update)
   - What: Edit an existing member’s profile and classification attributes.
   - Why: Keep records accurate while reflecting changes in civil or ecclesiastical data.
   - How: Server Action updates via application use case with validation and returns the updated DTO.
   - Functional requirements:
     - R2.1 The system must allow updating all non-immutable profile fields.
     - R2.2 No audit trail is required for now.

3) Member Archival (Soft Delete)
   - What: Archive a member record (reversible) without destroying data.
   - Why: Retain history while removing from active workflows.
   - How: Server Action marks status as Archived and invalidates related caches.
   - Functional requirements:
     - R3.1 The system must support an Archived status that hides members from default active lists while keeping them discoverable via filters.
     - R3.2 Archival must be reversible back to Active.
     - R3.3 No audit fields (reason/timestamp) are required for now.

4) Permanent Deletion (Hard Delete)
   - What: Permanently remove a member record.
   - Why: Comply with legal/operational requirements (e.g., LGPD requests or exceptional corrections).
   - How: Server Action performs hard delete with a two-step confirmation (no authorization/roles for now).
   - Functional requirements:
     - R4.1 The action must require a two-step confirmation (e.g., typing a confirmation phrase). No role checks or reason capture are required for now.
     - R4.2 The UI must clearly warn the user that deletion is irreversible.
     - R4.3 When deletion is required by privacy policies, ensure related personal data are removed, with minimal irreversible metadata retained only if legally allowed (e.g., tombstone log without PII).

5) Membership Status Management
   - What: Change a member’s classification and lifecycle status.
   - Why: Reflects reality and drives statistics and downstream reporting.
   - How: Server Action updates classification and/or status with business checks.
   - Functional requirements:
     - R5.1 The system must manage classification: Communicant vs. Non‑Communicant.
     - R5.2 The system must manage lifecycle visibility: Active and Archived. Removed is the result of hard delete and is not a selectable state.
     - R5.3 No audit trail is required for now.

6) Paginated and Filtered Member Search
   - What: List members with pagination and filters by name and profile (comum, presbítero).
   - Why: Efficient retrieval for secretarial workflows.
   - How: React Query hook calls a read Query Server Action; server returns a view DTO; client renders a table with controls.
   - Functional requirements:
     - R6.1 Default sort by name ascending; page size default 20; options: 20/50/100.
     - R6.2 Filters: by name (substring, case-insensitive) and profile as defined in docs; include visibility filter toggle (Active/Archived/All).
     - R6.3 No performance targets required; avoid unnecessary React re-renders in list/table interactions.
     - R6.4 Clicking a row navigates to the Member Detail page.

7) Member Detail Page
   - What: A dedicated page to view and act on a member’s profile.
   - Why: Centralize actions (update, archive, delete, change status) and show key data.
   - How: Server-driven page with actions wired through Server Actions and React Query invalidations.
   - Functional requirements:
     - R7.1 Show required fields and profile at a glance; group fields (civil, ecclesiastical, contact).
     - R7.2 Provide actions: Update, Archive/Restore, Change Classification, Delete Permanently.
     - R7.3 Confirmations and validation must be consistent and accessible.

8) UI Shell and Navigation
   - What: Application shell with a left sidebar using Shadcn UI.
   - Why: Consistent navigation and scalable layout as more modules are added.
   - How: Adopt Shadcn `dashboard-01` pattern as the base sidebar layout.
   - Functional requirements:
     - R8.1 The module must include a left sidebar per Shadcn `dashboard-01`.
     - R8.2 Navigation includes “Members” list and “New Member” entry points.

## User Experience

- Personas: secretaria (primary).
- Flows:
  - Search → Table → Detail: filter, navigate, act (update/archive/restore/delete, change classification).
  - New → Form → Create: validate required fields, confirm success, then navigate to detail.
- UI/UX guidelines:
  - Use accessible form components, descriptive errors, and keyboard-friendly controls.
  - Confirmation dialogs for archival/restoration/deletion; textual confirmation for hard delete.
  - Maintain consistent terms aligned with Linguagem Ubíqua (e.g., Communicant, Non‑Communicant; profile: comum, presbítero).
  - Sidebar layout from Shadcn `dashboard-01` for shell consistency.

## High-Level Technical Constraints

- Architecture: Next.js App Router; Server Actions as controllers; React Query hooks on the client; Prisma/Postgres persistence; DI container per @rules.
- DDD/CQRS: write side via use cases (application); read side via queries returning view DTOs; no direct fetch in hooks; cache keys centralized.
- Privacy/Compliance: Handle PII under LGPD. No authorization/roles for now.
- UI Performance: Avoid unnecessary React re-renders (stable props, proper list keying, localized updates). No numeric performance targets required.
- Internationalization: UI labels in PT‑BR; code and identifiers in EN (repo standard).

## Non-Goals (Out of Scope)

- Historical roll reconciliation or council-specific reporting.
- XLSX import/export parity (>99% structural parity) and validations engine.
- Financial records, pastoral acts, departments, or conciliar meeting tracking.
- External integrations (SSO, identity proofing) or mobile-specific apps.
- Audit trail and advanced permissions/roles.

## Phased Rollout Plan

- MVP
  - CRUD: create/update/archive/restore/hard delete (no auth/roles).
  - Admission/low (baixa) events and validations from docs/user.md and vocabulary.
  - Classification/visibility management (communicant/non‑communicant; active/archived).
  - Paginated/filtered search (name, profile per docs) and member detail page.
  - Shadcn sidebar shell in place (dashboard‑01).

There are no additional phases defined in this PRD; subsequent items are treated as out of scope.

## Risks and Mitigations

- Vocabulary drift vs. planilha/IPB
  - Mitigation: Fix controlled lists (enums) and glossary; align with Linguagem Ubíqua.
- Destructive actions clarity
  - Mitigation: Two-step confirmation for permanent delete; archive as default instead of delete.
- LGPD obligations and PII handling
  - Mitigation: Minimize PII; enable hard delete by authorized roles only; maintain non‑PII tombstone if allowed.
- Scope creep into reporting and events
  - Mitigation: Enforce phase boundaries; PRD non‑goals explicit.

## Open Questions

- None for now. Resolutions captured above:
  - Profiles: follow the source documents (docs) — do not limit to somente “comum/presbítero”.
  - Classification/state: follow the docs as the source of truth; lifecycle visibility uses Active/Archived; Removed is only via hard delete.
  - Roles/auth: not applicable for now.
  - Reception (CI/IPB art.16): included in MVP.
  - Audit: not required for now.

## Appendix

- Sources: docs/user.md (mandatory admission data), docs/linguagem-ubiqua.md (ubiquitous language), docs/dp.md (domain breakdown), and the IPB spreadsheet reference.
- Architecture rules: rules/architecture.rules.md and rules/layers.rules.md for layering, DDD/CQRS, and Server Action patterns.
