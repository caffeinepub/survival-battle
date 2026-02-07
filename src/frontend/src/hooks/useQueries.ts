import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PublicUserProfileView, PublicUserProfileInput, PublicTournamentDetails, TournamentId } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PublicUserProfileView | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: PublicUserProfileInput) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerWalletBalance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerWalletBalance();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminCreditWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const identity = await actor.getCallerUserRole();
      const principal = (actor as any)._principal;
      await actor.adminCreditWallet(principal, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

export function useListTournaments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicTournamentDetails[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listTournaments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTournamentDetails(tournamentId: TournamentId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicTournamentDetails>({
    queryKey: ['tournament', tournamentId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTournamentDetails(tournamentId);
    },
    enabled: !!actor && !actorFetching && !!tournamentId,
  });
}

export function useJoinTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: TournamentId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinTournament(tournamentId);
    },
    onSuccess: (_, tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}
