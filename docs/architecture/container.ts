import { FeaturedTournamentsGateway } from '@/application/gateways/featured-tournaments/featured-tournaments.gateway';
import { RegistrationsGateway } from '@/application/gateways/registrations/registrations.gateway';
import { TournamentsGateway } from '@/application/gateways/tournaments/tournaments.gateway';
import { ClubRequestGateway } from '@/application/gateways/club-request.gateway';
import { EnrollmentGateway } from '@/application/gateways/enrollment/enrollment.gateway';
import { TrainingGateway } from '@/application/gateways/training/training.gateway';
import { FamilyGateway } from '@/application/gateways/family.gateway';
import { AdminGateway } from '@/application/gateways/admin.gateway';
import { ClubGateway } from '@/application/gateways/club.gateway';
import { AuthGateway } from '@/application/gateways/auth.gateway';

import { FeaturedTournamentsGatewayApi } from '@/infrastructure/gateways/featured-tournaments.gateway.api';
import { RegistrationsGatewayApi } from '@/infrastructure/gateways/registrations.gateway.api';
import { ClubRequestGatewayApi } from '@/infrastructure/gateways/club-request.gateway.api';
import { TournamentsGatewayApi } from '@/infrastructure/gateways/tournaments.gateway.api';
import { EnrollmentGatewayApi } from '@/infrastructure/gateways/enrollment.gateway.api';
import { TrainingGatewayApi } from '@/infrastructure/gateways/training.gateway.api';
import { FamilyGatewayApi } from '@/infrastructure/gateways/family.gateway.api';
import { AdminGatewayApi } from '@/infrastructure/gateways/admin.gateway.api';
import { ClubGatewayApi } from '@/infrastructure/gateways/club.gateway.api';
import { AuthGatewayApi } from '@/infrastructure/gateways/auth.gateway.api';

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

function enrollmentGateway(accessToken: string): EnrollmentGateway {
  return new EnrollmentGatewayApi(apiUrl, accessToken);
}

function adminGateway(accessToken: string): AdminGateway {
  return new AdminGatewayApi(apiUrl, accessToken);
}

function trainingGateway(accessToken: string): TrainingGateway {
  return new TrainingGatewayApi(apiUrl, accessToken);
}

function clubRequestGateway(accessToken: string): ClubRequestGateway {
  return new ClubRequestGatewayApi(apiUrl, accessToken);
}

function clubGateway(accessToken: string): ClubGateway {
  return new ClubGatewayApi(apiUrl, accessToken);
}

function familyGateway(accessToken: string): FamilyGateway {
  return new FamilyGatewayApi(apiUrl, accessToken);
}

function authGateway(): AuthGateway {
  return new AuthGatewayApi(apiUrl);
}

function tournamentsGateway(accessToken: string): TournamentsGateway {
  return new TournamentsGatewayApi(apiUrl, accessToken);
}

function featuredTournamentsGateway(accessToken: string): FeaturedTournamentsGateway {
  return new FeaturedTournamentsGatewayApi(apiUrl, accessToken);
}

function registrationsGateway(accessToken: string): RegistrationsGateway {
  return new RegistrationsGatewayApi(apiUrl, accessToken);
}

export const Inject = {
  FeaturedTournamentsGateway: featuredTournamentsGateway,
  RegistrationsGateway: registrationsGateway,
  TournamentsGateway: tournamentsGateway,
  ClubRequestGateway: clubRequestGateway,
  EnrollmentGateway: enrollmentGateway,
  TrainingGateway: trainingGateway,
  FamilyGateway: familyGateway,
  AdminGateway: adminGateway,
  ClubGateway: clubGateway,
  AuthGateway: authGateway,
};
