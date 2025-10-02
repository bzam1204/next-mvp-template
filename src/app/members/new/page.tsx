'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useRegisterMember } from '@/infrastructure/hooks/members/use-register-member';

import { MemberForm, createEmptyMemberFormValues, type MemberFormValues } from '../_components/member-form';
import { buildRegisterMemberInput } from '../_components/member-form-adapters';

export default function NewMemberPage() {
    const router = useRouter();
    const registerMember = useRegisterMember();
    const [serverError, setServerError] = useState<string | null>(null);

    const initialValues = useMemo(() => createEmptyMemberFormValues(), []);

    const handleSubmit = useCallback(
        async (values: MemberFormValues) => {
            try {
                setServerError(null);
                const payload = buildRegisterMemberInput(values);
                const member = await registerMember.mutateAsync(payload);
                router.replace(`/members/${member.id}`);
            } catch (error) {
                if (error instanceof Error) {
                    setServerError(error.message);
                } else {
                    setServerError('Não foi possível registrar o membro.');
                }
            }
        },
        [registerMember, router],
    );

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                        <Link href="/members">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">Novo membro</h1>
                </div>
            </div>

            <Card className="border-sky-200 dark:border-sky-900">
                <CardHeader>
                    <CardTitle>Cadastro inicial</CardTitle>
                    <CardDescription>
                        Preencha os dados obrigatórios definidos pela IPB. Todos os campos marcados com * são obrigatórios.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <MemberForm
                        mode="create"
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        submitLabel="Registrar membro"
                        busy={registerMember.isPending}
                        serverError={serverError}
                    />
                </CardContent>
            </Card>
        </main>
    );
}
