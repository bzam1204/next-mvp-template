'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Archive, CheckCircle2, RotateCcw, Trash2, Undo2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useMemberById } from '@/infrastructure/hooks/members/use-member-by-id';
import { useArchiveMember } from '@/infrastructure/hooks/members/use-archive-member';
import { useRestoreMember } from '@/infrastructure/hooks/members/use-restore-member';
import { useChangeMemberClassification } from '@/infrastructure/hooks/members/use-change-member-classification';
import { useDeleteMemberPermanently } from '@/infrastructure/hooks/members/use-delete-member-permanently';

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return '—';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(parsed);
}

export default function MemberDetailPage() {
    const params = useParams<{ id: string }>();
    const memberId = params?.id;
    const router = useRouter();

    const { data: member, isLoading, error } = useMemberById(memberId, { enabled: Boolean(memberId) });

    const archiveMember = useArchiveMember();
    const restoreMember = useRestoreMember();
    const changeClassification = useChangeMemberClassification();
    const { reset: resetDeleteMember, ...deleteMember } = useDeleteMemberPermanently();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const isBusy = archiveMember.isPending || restoreMember.isPending || changeClassification.isPending || deleteMember.isPending;
    const deleteExpectedPhrase = useMemo(() => (member ? `DELETE ${member.id}` : ''), [member]);
    const deleteDisabled = !member || deleteInput.trim() !== deleteExpectedPhrase || deleteMember.isPending;

    useEffect(() => {
        if (!deleteDialogOpen) {
            setDeleteInput('');
            resetDeleteMember();
        }
    }, [deleteDialogOpen, resetDeleteMember]);

    const handleArchiveToggle = useCallback(async () => {
        if (!member) return;
        if (member.status === 'active') {
            await archiveMember.mutateAsync({ memberId: member.id });
        } else {
            await restoreMember.mutateAsync({ memberId: member.id });
        }
    }, [archiveMember, member, restoreMember]);

    const handleClassificationChange = useCallback(
        async (classification: 'communicant' | 'non-communicant') => {
            if (!member || member.classification === classification) return;
            await changeClassification.mutateAsync({ memberId: member.id, classification });
        },
        [changeClassification, member],
    );

    const handleDelete = useCallback(async () => {
        if (!member) return;
        await deleteMember.mutateAsync({ memberId: member.id, confirm: deleteInput.trim() });
        setDeleteDialogOpen(false);
        router.replace('/members');
    }, [deleteInput, deleteMember, member, router]);

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
                        <Link href="/members">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">Ficha do membro</h1>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <ThemeToggle />
                    {member ? (
                        <Button asChild variant="secondary" size="sm" className="gap-2">
                            <Link href={`/members/${member.id}/edit`}>Editar dados</Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="py-12 text-center text-sm text-gray-500">Carregando informações…</CardContent>
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
            ) : member ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <span>{member.fullName}</span>
                                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                    {member.status === 'active' ? 'Ativo' : 'Arquivado'}
                                </Badge>
                            </CardTitle>
                            <CardDescription>ID {member.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoField label="Classificação">
                                    <span className="font-medium">
                                        {member.classification === 'communicant' ? 'Comungante' : 'Não comungante'}
                                    </span>
                                </InfoField>
                                <InfoField label="CPF">{member.cpf ?? '—'}</InfoField>
                                <InfoField label="Email">{member.email ?? '—'}</InfoField>
                                <InfoField label="Telefone">{member.phone ?? '—'}</InfoField>
                                <InfoField label="Nascimento">{formatDate(member.birthDate)}</InfoField>
                                <InfoField label="Naturalidade">{member.placeOfBirth}</InfoField>
                                <InfoField label="Estado civil">
                                    {member.maritalStatus === 'single'
                                        ? 'Solteiro(a)'
                                        : member.maritalStatus === 'married'
                                            ? 'Casado(a)'
                                            : member.maritalStatus === 'divorced'
                                                ? 'Divorciado(a)'
                                                : 'Viúvo(a)'}
                                </InfoField>
                                <InfoField label="Batizado na infância">{member.baptizedInInfancy ? 'Sim' : 'Não'}</InfoField>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                //todo: adicionar data do batismo nos dados a seerem salvos e editados sobre o membro. a ipb quer saber sobre o a data que o membro foi batizado.isso tem um impacto desde o banco ao front. cabe uma analise detalhada.
                                <InfoField label="Data de Profissão de fé">
                                    {member.professionOfFaithDate ? formatDate(member.professionOfFaithDate) : '—'}
                                </InfoField>
                                <InfoField label="Celebrante">{member.celebrant}</InfoField>
                                <InfoField label="Antecedentes religiosos">{member.religiousBackground}</InfoField>
                                <InfoField label="Recepção">
                                    <div className="flex flex-col">
                                        <span>{formatDate(member.reception?.date)}</span>
                                        <span className="text-xs text-gray-500">
                                            //todo: adicionar opçãos de 'profissão de fé e batismo', isso tem um impacto desde o banco ao front. cabe uma analise detalhada.
                                            {member.reception?.mode === 'profession_of_faith'
                                                ? 'Profissão de fé'
                                                : member.reception?.mode === 'transfer'
                                                    ? 'Transferência'
                                                    : 'Restauração'}
                                        </span>
                                    </div>
                                </InfoField>
                                <InfoField label="Local de recepção">{member.reception?.location ?? '—'}</InfoField>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600">Endereço</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {member.address.street}
                                    {member.address.number ? `, ${member.address.number}` : ''}
                                    {member.address.district ? ` - ${member.address.district}` : ''}
                                    <br />
                                    {member.address.city}
                                    {member.address.state ? `/${member.address.state}` : ''}
                                    {member.address.zip ? ` • CEP ${member.address.zip}` : ''}
                                    {member.address.complement ? ` • ${member.address.complement}` : ''}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={member.status === 'active' ? 'secondary' : 'default'}
                                    className="gap-2"
                                    disabled={isBusy}
                                    onClick={handleArchiveToggle}
                                >
                                    {member.status === 'active' ? (
                                        <>
                                            <Archive className="h-4 w-4" /> Arquivar
                                        </>
                                    ) : (
                                        <>
                                            <Undo2 className="h-4 w-4" /> Restaurar
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant={member.classification === 'communicant' ? 'default' : 'secondary'}
                                    className="gap-2"
                                    disabled={isBusy || member.classification === 'communicant'}
                                    onClick={() => handleClassificationChange('communicant')}
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Marcar como comungante
                                </Button>
                                <Button
                                    variant={member.classification === 'non-communicant' ? 'default' : 'secondary'}
                                    className="gap-2"
                                    disabled={isBusy || member.classification === 'non-communicant'}
                                    onClick={() => handleClassificationChange('non-communicant')}
                                >
                                    <RotateCcw className="h-4 w-4" /> Marcar como não comungante
                                </Button>
                            </div>

                            {(archiveMember.error || restoreMember.error || changeClassification.error) && (
                                <p className="text-sm text-red-500">
                                    {archiveMember.error?.message || restoreMember.error?.message || changeClassification.error?.message}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-300">
                                <Trash2 className="h-5 w-5" /> Exclusão permanente
                            </CardTitle>
                            <CardDescription>
                                Esta ação não pode ser desfeita. Para continuar, confirme digitando <code className="rounded bg-red-100 px-1 py-0.5 text-xs text-red-600">{deleteExpectedPhrase}</code> na caixa de confirmação.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="gap-2 self-end"
                                        disabled={!member || deleteMember.isPending || isBusy}
                                    >
                                        <Trash2 className="h-4 w-4" /> Excluir permanentemente
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm permanent deletion</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action removes the member permanently and cannot be undone. Type the exact phrase <span className="font-semibold">{deleteExpectedPhrase}</span> to proceed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="delete-confirm-dialog">Confirmation</Label>
                                        <Input
                                            id="delete-confirm-dialog"
                                            value={deleteInput}
                                            autoComplete="off"
                                            onChange={(event) => setDeleteInput(event.target.value)}
                                            disabled={deleteMember.isPending}
                                            placeholder={deleteExpectedPhrase}
                                        />
                                    </div>
                                    {deleteMember.error ? (
                                        <p className="text-sm text-red-500">{deleteMember.error.message}</p>
                                    ) : null}
                                    <AlertDialogFooter>
                                        <AlertDialogCancel asChild>
                                            <Button variant="secondary">Cancel</Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button
                                                variant="destructive"
                                                className="gap-2"
                                                onClick={handleDelete}
                                                disabled={deleteDisabled}
                                            >
                                                <Trash2 className="h-4 w-4" /> Permanently delete
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </>
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

function InfoField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
            <span className="text-gray-900 dark:text-gray-100">{children}</span>
        </div>
    );
}
