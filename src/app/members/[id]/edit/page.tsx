'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme/theme-toggle';

import { useMemberById } from '@/infrastructure/hooks/members/use-member-by-id';
import { useUpdateMember } from '@/infrastructure/hooks/members/use-update-member';

import { MemberForm, type MemberFormValues } from '../../_components/member-form';
import { buildUpdateMemberInput, memberViewToFormValues } from '../../_components/member-form-adapters';

export default function EditMemberPage() {
    const params = useParams<{ id: string }>();
    const memberId = params?.id;
    const router = useRouter();

    const { data: member, isLoading, error } = useMemberById(memberId, { enabled: Boolean(memberId) });
    const updateMember = useUpdateMember();
    const [serverError, setServerError] = useState<string | null>(null);

    const initialValues = useMemo(() => (member ? memberViewToFormValues(member) : undefined), [member]);

    const handleSubmit = useCallback(
        async (values: MemberFormValues) => {
            if (!member) return;
            try {
                setServerError(null);
                const payload = buildUpdateMemberInput(member.id, values);
                await updateMember.mutateAsync(payload);
                router.replace(`/members/${member.id}`);
            } catch (caught) {
                if (caught instanceof Error) {
                    setServerError(caught.message);
                } else {
                    setServerError('Não foi possível atualizar o membro.');
                }
            }
        },
        [member, router, updateMember],
    );

    if (!memberId) {
        return (
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
                <div className="flex justify-end">
                    <ThemeToggle />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Membro não encontrado</CardTitle>
                        <CardDescription>O identificador informado não é válido.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/members">Voltar para lista</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                        <Link href={`/members/${memberId}`}>
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">Editar membro</h1>
                </div>
                <ThemeToggle />
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="py-12 text-center text-sm text-gray-500">Carregando dados do membro…</CardContent>
                </Card>
            ) : error ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Erro ao carregar</CardTitle>
                        <CardDescription>{error.message}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" onClick={() => window.location.reload()}>Tentar novamente</Button>
                    </CardContent>
                </Card>
            ) : member && initialValues ? (
                <Card className="border-sky-200 dark:border-sky-900">
                    <CardHeader>
                        <CardTitle>Edição de dados</CardTitle>
                        <CardDescription>Atualize apenas os campos necessários. Classificação e status são gerenciados pela ficha do membro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <MemberForm
                            mode="edit"
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            submitLabel="Salvar alterações"
                            busy={updateMember.isPending}
                            serverError={serverError}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-sm text-gray-500">
                        Membro não encontrado.
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
