export const MEMBER_SEX_OPTIONS = [
    { label: 'Masculino', value: 'male' },
    { label: 'Feminino', value: 'female' },
] as const;

export const MEMBER_MARITAL_STATUS_OPTIONS = [
    { label: 'Solteiro(a)', value: 'single' },
    { label: 'Casado(a)', value: 'married' },
    { label: 'Divorciado(a)', value: 'divorced' },
    { label: 'Viúvo(a)', value: 'widowed' },
] as const;

export const MEMBER_RECEPTION_MODE_OPTIONS = [
    { label: 'Profissão de Fé', value: 'profession_of_faith' },
    { label: 'Transferência', value: 'transfer' },
    { label: 'Restauração', value: 'restoration' },
] as const;

export const MEMBER_CLASSIFICATION_OPTIONS = [
    { label: 'Comungante', value: 'communicant' },
    { label: 'Não Comungante', value: 'non-communicant' },
] as const;

export const MEMBER_VISIBILITY_FILTERS = [
    { label: 'Ativos', value: 'active' },
    { label: 'Arquivados', value: 'archived' },
    { label: 'Todos', value: 'all' },
] as const;

export type MemberSexOption = (typeof MEMBER_SEX_OPTIONS)[number]['value'];
export type MemberMaritalStatusOption = (typeof MEMBER_MARITAL_STATUS_OPTIONS)[number]['value'];
export type MemberReceptionModeOption = (typeof MEMBER_RECEPTION_MODE_OPTIONS)[number]['value'];
export type MemberClassificationOption = (typeof MEMBER_CLASSIFICATION_OPTIONS)[number]['value'];
