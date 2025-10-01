export const ServiceTokens = {
    EventLog: Symbol("EventLog"),
    EventBus: Symbol("EventBus"),
    UnitOfWork: Symbol("UnitOfWork"),
    HeroMapper: Symbol("HeroMapper"),
    IdGenerator: Symbol("IdGenerator"),
    PrismaClient: Symbol("PrismaClient"),
    QueryService: Symbol("QueryService"),
    CreateHeroUseCase: Symbol("CreateHeroUseCase"),
    RenameHeroUseCase: Symbol("RenameHeroUseCase"),
    LevelUpHeroUseCase: Symbol("LevelUpHeroUseCase"),
} as const;

export type ServiceToken = (typeof ServiceTokens)[ServiceTokenKeys];
export type ServiceTokenKeys = keyof typeof ServiceTokens;
