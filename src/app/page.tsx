'use client';

import { useMemo, useState, type FormEvent } from "react";

import { Flame, Sparkles, Zap } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useHeroes } from "@/infrastructure/hooks/hero/use-heroes";
import { useCreateHero } from "@/infrastructure/hooks/hero/use-create-hero";
import { useRenameHero } from "@/infrastructure/hooks/hero/use-rename-hero";
import { useHeroEvents } from "@/infrastructure/hooks/events/use-hero-events";
import { useLevelUpHero } from "@/infrastructure/hooks/hero/use-level-up-hero";

export default function HeroPlayground() {
    const [heroName, setHeroName] = useState("");
    const [renameDrafts, setRenameDrafts] = useState<Record<string, string>>({});

    const { data: heroesView, isLoading: loadingHeroes } = useHeroes();
    const DEFAULT_EVENT_LIMIT = 8;
    const { data: events = [] } = useHeroEvents(DEFAULT_EVENT_LIMIT);

    const createHero = useCreateHero();
    const renameHero = useRenameHero();
    const levelUpHero = useLevelUpHero();

    const heroes = useMemo(() => heroesView?.items ?? [], [heroesView]);

    const sortedHeroes = useMemo(() => {
        return [...heroes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [heroes]);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!heroName.trim()) return;
        await createHero.mutateAsync({ name: heroName.trim() });
        setHeroName("");
    };

    const handleRename = async (heroId: string) => {
        const nextName = renameDrafts[heroId]?.trim();
        if (!nextName) return;
        await renameHero.mutateAsync({ heroId, newName: nextName });
        setRenameDrafts((prev) => ({ ...prev, [heroId]: "" }));
    };

    const handleLevelUp = async (heroId: string) => {
        await levelUpHero.mutateAsync({ heroId });
    };

    const busy = createHero.isPending || renameHero.isPending || levelUpHero.isPending;

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
                        Hero Domain Template
                    </span>
                </div>
                <h1 className="text-3xl font-semibold">Next.js CQRS + Events</h1>
                <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    This playground demonstrates an end-to-end flow: UI actions trigger Use Cases, the domain emits events,
                    and the EventBus makes them available for real-time visualization.
                </p>
            </header>

            <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Create new hero</CardTitle>
                        <CardDescription>Create a hero to trigger the <Badge className="ml-1">HeroCreated</Badge> event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="heroName">Hero name</Label>
                                <Input
                                    id="heroName"
                                    placeholder="e.g., Aurora"
                                    value={heroName}
                                    onChange={(event) => setHeroName(event.target.value)}
                                    disabled={busy}
                                />
                            </div>
                            <Button type="submit" disabled={busy || heroName.trim().length < 2}>
                                Create hero
                            </Button>
                            {createHero.error ? (
                                <p className="text-sm text-red-500">{createHero.error.message}</p>
                            ) : null}
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-rose-500" /> Recent events
                        </CardTitle>
                        <CardDescription>Lightweight feed powered by the in-memory EventBus.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-3 text-sm">
                            {events.length === 0 ? (
                                <li className="text-gray-500">No events recorded yet.</li>
                            ) : (
                                events.map((event) => (
                                    <li key={event.id} className="rounded-md border border-gray-200 px-3 py-2 dark:border-gray-800">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(event.occurredAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        {event.aggregateId ? (
                                            <p className="text-xs text-gray-500">Hero: {event.aggregateId}</p>
                                        ) : null}
                                    </li>
                                ))
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4">
                <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-sky-500" />
                    <h2 className="text-xl font-semibold">Heroes ({sortedHeroes.length})</h2>
                </div>
                {loadingHeroes ? (
                    <p className="text-sm text-gray-500">Loading heroes...</p>
                ) : sortedHeroes.length === 0 ? (
                    <p className="text-sm text-gray-500">No heroes registered yet.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {sortedHeroes.map((hero) => (
                            <Card key={hero.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{hero.name}</CardTitle>
                                        <Badge variant="secondary">Power {hero.power}</Badge>
                                    </div>
                                    <CardDescription>
                                        Created on {new Date(hero.createdAt).toLocaleString("en-US", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="New name"
                                            value={renameDrafts[hero.id] ?? ""}
                                            onChange={(event) =>
                                                setRenameDrafts((prev) => ({ ...prev, [hero.id]: event.target.value }))
                                            }
                                            disabled={busy}
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleRename(hero.id)}
                                            disabled={busy || !renameDrafts[hero.id]?.trim()}
                                        >
                                            Rename
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleLevelUp(hero.id)} disabled={busy}>
                                            Level up
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {(renameHero.error || levelUpHero.error) && (
                    <p className="text-sm text-red-500">
                        {renameHero.error?.message ?? levelUpHero.error?.message}
                    </p>
                )}
            </section>
        </main>
    );
}
