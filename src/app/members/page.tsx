'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { useSearchMembers } from '@/infrastructure/hooks/members/use-search-members';

import { MEMBER_VISIBILITY_FILTERS } from './_components/member-fields';

const PAGE_SIZE = 10;

interface AppliedFilters {
    name: string;
    profile: string;
    visibility: 'active' | 'archived' | 'all';
}

function parsePage(value: string | null): number {
    if (!value) return 1;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export default function MembersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const appliedFilters: AppliedFilters = useMemo(() => {
        const visibilityParam = searchParams?.get('visibility');
        const normalizedVisibility = visibilityParam === 'archived' || visibilityParam === 'all' ? visibilityParam : 'active';

        return {
            name: (searchParams?.get('name') ?? '').trim(),
            profile: (searchParams?.get('profile') ?? '').trim(),
            visibility: normalizedVisibility,
        };
    }, [searchParams]);

    const currentPage = useMemo(() => parsePage(searchParams?.get('page') ?? null), [searchParams]);

    const [name, setName] = useState(appliedFilters.name);
    const [profile, setProfile] = useState(appliedFilters.profile);
    const [visibility, setVisibility] = useState<AppliedFilters['visibility']>(appliedFilters.visibility);

    useEffect(() => {
        setName(appliedFilters.name);
        setProfile(appliedFilters.profile);
        setVisibility(appliedFilters.visibility);
    }, [appliedFilters]);

    const { data, isLoading, isFetching, error } = useSearchMembers({
        page: currentPage,
        pageSize: PAGE_SIZE,
        name: appliedFilters.name || undefined,
        profile: appliedFilters.profile || undefined,
        visibility: appliedFilters.visibility,
    });

    const totalItems = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const items = useMemo(() => data?.items ?? [], [data]);

    const updateQueryString = useCallback(
        (updates: Record<string, string | number | undefined>) => {
            const params = new URLSearchParams(searchParams?.toString() ?? '');
            Object.entries(updates).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });
            router.replace(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams],
    );

    const handleFiltersSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            updateQueryString({
                name: name || undefined,
                profile: profile || undefined,
                visibility,
                page: 1,
            });
        },
        [name, profile, updateQueryString, visibility],
    );

    const handleClearFilters = useCallback(() => {
        setName('');
        setProfile('');
        setVisibility('active');
        updateQueryString({ name: undefined, profile: undefined, visibility: undefined, page: 1 });
    }, [updateQueryString]);

    const handlePageChange = useCallback(
        (nextPage: number) => {
            const safePage = Math.min(Math.max(nextPage, 1), totalPages);
            updateQueryString({ page: safePage });
        },
        [totalPages, updateQueryString],
    );

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-semibold">Membros</h1>
                    <p className="text-sm text-gray-500">Busque, filtre e navegue pela base de membros registrados.</p>
                </div>
                <Button asChild>
                    <Link href="/members/new" className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Novo membro
                    </Link>
                </Button>
            </header>

            <section className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
                <form className="grid gap-4 md:grid-cols-[2fr_2fr_1fr_auto] md:items-end" onSubmit={handleFiltersSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-name">Nome</Label>
                        <Input
                            id="filter-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Pesquisar por nome"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-profile">Perfil</Label>
                        <Input
                            id="filter-profile"
                            value={profile}
                            onChange={(event) => setProfile(event.target.value)}
                            placeholder="Ex.: presbítero"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-visibility">Visibilidade</Label>
                        <select
                            id="filter-visibility"
                            value={visibility}
                            onChange={(event) => setVisibility(event.target.value as AppliedFilters['visibility'])}
                            disabled={isLoading}
                            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                        >
                            {MEMBER_VISIBILITY_FILTERS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            Filtrar
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleClearFilters} disabled={isLoading}>
                            Limpar
                        </Button>
                    </div>
                </form>
            </section>

            <section className="grid gap-4 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <span>•</span>
                        <span>{totalItems} registros</span>
                        {isFetching ? (
                            <span className="inline-flex items-center gap-1 text-sky-600">
                                <Loader2 className="h-4 w-4 animate-spin" /> Atualizando…
                            </span>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="gap-1"
                        >
                            <ArrowLeft className="h-4 w-4" /> Anterior
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="gap-1"
                        >
                            Próxima <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
                        Não foi possível carregar os membros: {error.message}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando membros…
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-gray-500">
                        <p>Nenhum membro encontrado com os filtros atuais.</p>
                        <Button variant="secondary" size="sm" onClick={handleClearFilters} className="gap-2">
                            <Plus className="h-4 w-4" /> Limpar filtros
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Nome</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Classificação</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Cidade</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {items.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{member.fullName}</div>
                                            <div className="text-xs text-gray-500">CPF: {member.cpf ?? '—'}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">{member.classification === 'communicant' ? 'Comungante' : 'Não comungante'}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                                {member.status === 'active' ? 'Ativo' : 'Arquivado'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">{member.address?.city ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <Button variant="outline" size="sm" asChild className="gap-2">
                                                <Link href={`/members/${member.id}`}>
                                                    Ver ficha
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
