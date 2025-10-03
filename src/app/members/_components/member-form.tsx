'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import {
    MEMBER_CLASSIFICATION_OPTIONS,
    MEMBER_MARITAL_STATUS_OPTIONS,
    MEMBER_RECEPTION_MODE_OPTIONS,
    MEMBER_SEX_OPTIONS,
    type MemberClassificationOption,
    type MemberMaritalStatusOption,
    type MemberReceptionModeOption,
    type MemberSexOption,
} from './member-fields';

export interface MemberFormValues {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    sex: MemberSexOption | '';
    maritalStatus: MemberMaritalStatusOption | '';
    classification: MemberClassificationOption | '';
    birthDate: string;
    placeOfBirth: string;
    literacy: boolean;
    professionOfFaithDate: string;
    celebrant: string;
    religiousBackground: string;
    receptionDate: string;
    receptionMode: MemberReceptionModeOption | '';
    receptionLocation: string;
    baptizedInInfancy: boolean;
    addressStreet: string;
    addressNumber: string;
    addressDistrict: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    addressComplement: string;
}

export interface MemberFormProps {
    mode: 'create' | 'edit';
    initialValues: MemberFormValues;
    onSubmit: (values: MemberFormValues) => Promise<void>;
    submitLabel: string;
    busy?: boolean;
    serverError?: string | null;
}

const EMPTY_FORM_VALUES: MemberFormValues = {
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    sex: '',
    maritalStatus: '',
    classification: 'communicant',
    birthDate: '',
    placeOfBirth: '',
    literacy: false,
    professionOfFaithDate: '',
    celebrant: '',
    religiousBackground: '',
    receptionDate: '',
    receptionMode: '',
    receptionLocation: '',
    baptizedInInfancy: false,
    addressStreet: '',
    addressNumber: '',
    addressDistrict: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    addressComplement: '',
};

export function createEmptyMemberFormValues(): MemberFormValues {
    return { ...EMPTY_FORM_VALUES };
}

export function MemberForm({ mode, initialValues, onSubmit, submitLabel, busy = false, serverError }: MemberFormProps) {
    const [values, setValues] = useState<MemberFormValues>(() => ({ ...EMPTY_FORM_VALUES, ...initialValues }));
    const [clientErrors, setClientErrors] = useState<string[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        setValues((prev) => ({ ...prev, ...initialValues }));
    }, [initialValues]);

    const isCreateMode = mode === 'create';

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = event.target;
        setValues((prev) => {
            if (type === 'checkbox') {
                return { ...prev, [name]: checked };
            }
            return { ...prev, [name]: value };
        });
    };

    const derivedErrors = useMemo(() => clientErrors, [clientErrors]);

    const validate = (form: MemberFormValues): string[] => {
        const errors: string[] = [];

        const requiredTextFields: Array<[keyof MemberFormValues, string]> = [
            ['fullName', 'Nome completo é obrigatório.'],
            ['placeOfBirth', 'Naturalidade é obrigatória.'],
            ['celebrant', 'Celebrante é obrigatório.'],
            ['religiousBackground', 'Antecedentes religiosos são obrigatórios.'],
            ['receptionLocation', 'Local de recepção é obrigatório.'],
            ['addressStreet', 'Logradouro é obrigatório.'],
            ['addressCity', 'Cidade é obrigatória.'],
        ];

        requiredTextFields.forEach(([field, message]) => {
            if (!form[field]?.toString().trim()) {
                errors.push(message);
            }
        });

        if (!form.birthDate) {
            errors.push('Data de nascimento é obrigatória.');
        }

        if (!form.receptionDate) {
            errors.push('Data de recepção é obrigatória.');
        }

        if (!form.professionOfFaithDate) {
            errors.push('Data de Profissão de fé é obrigatória.');
        }

        if (!form.sex) {
            errors.push('Sexo é obrigatório.');
        }

        if (!form.maritalStatus) {
            errors.push('Estado civil é obrigatório.');
        }

        if (!form.receptionMode) {
            errors.push('Modo de recepção é obrigatório.');
        }

        if (isCreateMode && !form.classification) {
            errors.push('Classificação é obrigatória.');
        }

        return errors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHasSubmitted(true);
        const errors = validate(values);
        if (errors.length > 0) {
            setClientErrors(errors);
            return;
        }
        setClientErrors([]);
        await onSubmit(values);
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <section className="grid gap-4 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
                <header>
                    <h2 className="text-lg font-semibold">Dados pessoais</h2>
                    <p className="text-sm text-gray-500">Campos obrigatórios garantem conformidade com a IPB.</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome completo" htmlFor="fullName" required>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={values.fullName}
                            onChange={handleInputChange}
                            disabled={busy}
                            placeholder="Ex.: João da Silva"
                        />
                    </Field>
                    <Field label="Email" htmlFor="email">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleInputChange}
                            disabled={busy}
                            placeholder="email@exemplo.com"
                        />
                    </Field>
                    <Field label="Telefone" htmlFor="phone">
                        <Input
                            id="phone"
                            name="phone"
                            value={values.phone}
                            onChange={handleInputChange}
                            disabled={busy}
                            placeholder="(11) 99999-9999"
                        />
                    </Field>
                    <Field label="CPF" htmlFor="cpf">
                        <Input
                            id="cpf"
                            name="cpf"
                            value={values.cpf}
                            onChange={handleInputChange}
                            disabled={busy}
                            placeholder="000.000.000-00"
                        />
                    </Field>
                    {isCreateMode ? (
                        <Field label="Classificação" htmlFor="classification" required>
                            <select
                                id="classification"
                                name="classification"
                                value={values.classification}
                                onChange={handleInputChange}
                                disabled={busy}
                                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <option value="" disabled>
                                    Selecione...
                                </option>
                                {MEMBER_CLASSIFICATION_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    ) : (
                        <Field label="Classificação" htmlFor="classification">
                            <Input id="classification" name="classification" value={values.classification} readOnly disabled />
                            <p className="text-xs text-gray-500">
                                Altere a classificação pelo painel de ações na ficha do membro.
                            </p>
                        </Field>
                    )}
                    <Field label="Sexo" htmlFor="sex" required>
                        <select
                            id="sex"
                            name="sex"
                            value={values.sex}
                            onChange={handleInputChange}
                            disabled={busy}
                            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                        >
                            <option value="" disabled>
                                Selecione...
                            </option>
                            {MEMBER_SEX_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Estado civil" htmlFor="maritalStatus" required>
                        <select
                            id="maritalStatus"
                            name="maritalStatus"
                            value={values.maritalStatus}
                            onChange={handleInputChange}
                            disabled={busy}
                            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                        >
                            <option value="" disabled>
                                Selecione...
                            </option>
                            {MEMBER_MARITAL_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Data de nascimento" htmlFor="birthDate" required>
                        <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={values.birthDate}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Naturalidade" htmlFor="placeOfBirth" required>
                        <Input
                            id="placeOfBirth"
                            name="placeOfBirth"
                            value={values.placeOfBirth}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FieldCheckbox
                        id="literacy"
                        name="literacy"
                        checked={values.literacy}
                        disabled={busy}
                        onChange={handleInputChange}
                        /**
                         * todo: add scolarity 
                         * search using perplexity mcp about how brasil is doing in terms of literacy and scolarity and create an field for scolarity. the database mus be updated too. scolarity must be an enum in the database. 
                         * read the @rules to understand thet project and use context7 mcp to get fresh documentation
                         * use also playwright mcp to validate changes
                         * focus on your task
                         * 
                         */ 
                        label="Sabe ler e escrever"
                    />
                    <FieldCheckbox
                        id="baptizedInInfancy"
                        name="baptizedInInfancy"
                        checked={values.baptizedInInfancy}
                        disabled={busy}
                        onChange={handleInputChange}
                        label="Batizado(a) na infância"
                    />
                </div>
            </section>

            <section className="grid gap-4 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
                <header>
                    <h2 className="text-lg font-semibold">Dados eclesiásticos</h2>
                    <p className="text-sm text-gray-500">Informações utilizadas para recepção e estatísticas.</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Data de Profissão de fé" htmlFor="professionOfFaithDate" required>
                        <Input
                            id="professionOfFaithDate"
                            name="professionOfFaithDate"
                            type="date"
                            value={values.professionOfFaithDate}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Celebrante" htmlFor="celebrant" required>
                        <Input
                            id="celebrant"
                            name="celebrant"
                            value={values.celebrant}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Antecedentes religiosos" htmlFor="religiousBackground" required>
                        <Input
                            id="religiousBackground"
                            name="religiousBackground"
                            value={values.religiousBackground}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Data de recepção" htmlFor="receptionDate" required>
                        <Input
                            id="receptionDate"
                            name="receptionDate"
                            type="date"
                            value={values.receptionDate}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Modo de recepção" htmlFor="receptionMode" required>
                        <select
                            id="receptionMode"
                            name="receptionMode"
                            value={values.receptionMode}
                            onChange={handleInputChange}
                            disabled={busy}
                            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                        >
                            <option value="" disabled>
                                Selecione...
                            </option>
                            {MEMBER_RECEPTION_MODE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Local de recepção" htmlFor="receptionLocation" required>
                        <Input
                            id="receptionLocation"
                            name="receptionLocation"
                            value={values.receptionLocation}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                </div>
            </section>

            <section className="grid gap-4 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
                <header>
                    <h2 className="text-lg font-semibold">Endereço</h2>
                    <p className="text-sm text-gray-500">Utilizado para contato e estatísticas.</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Logradouro" htmlFor="addressStreet" required>
                        <Input
                            id="addressStreet"
                            name="addressStreet"
                            value={values.addressStreet}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Número" htmlFor="addressNumber">
                        <Input
                            id="addressNumber"
                            name="addressNumber"
                            value={values.addressNumber}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Bairro" htmlFor="addressDistrict">
                        <Input
                            id="addressDistrict"
                            name="addressDistrict"
                            value={values.addressDistrict}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Cidade" htmlFor="addressCity" required>
                        <Input
                            id="addressCity"
                            name="addressCity"
                            value={values.addressCity}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Estado" htmlFor="addressState">
                        <Input
                            id="addressState"
                            name="addressState"
                            value={values.addressState}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="CEP" htmlFor="addressZip">
                        <Input
                            id="addressZip"
                            name="addressZip"
                            value={values.addressZip}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                    <Field label="Complemento" htmlFor="addressComplement">
                        <Input
                            id="addressComplement"
                            name="addressComplement"
                            value={values.addressComplement}
                            onChange={handleInputChange}
                            disabled={busy}
                        />
                    </Field>
                </div>
            </section>

            {derivedErrors.length > 0 && hasSubmitted ? (
                <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                    <p className="font-semibold">Verifique os campos:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                        {derivedErrors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {serverError ? (
                <div className="rounded-md border border-orange-300 bg-orange-50 p-4 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200">
                    {serverError}
                </div>
            ) : null}

            <div className="flex items-center justify-end gap-3">
                <Button type="submit" disabled={busy}>
                    {busy ? 'Processando…' : submitLabel}
                </Button>
            </div>
        </form>
    );
}

interface FieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: ReactNode;
}

function Field({ label, htmlFor, required = false, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={htmlFor}>
                {label}
                {required ? <span className="ml-1 text-red-500">*</span> : null}
            </Label>
            {children}
        </div>
    );
}

interface FieldCheckboxProps {
    id: string;
    name: string;
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FieldCheckbox({ id, name, label, checked, disabled, onChange }: FieldCheckboxProps) {
    return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            />
            <span>{label}</span>
        </label>
    );
}
