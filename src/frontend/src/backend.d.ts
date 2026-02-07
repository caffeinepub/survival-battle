import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PublicUserProfileView {
    freeFireUid?: string;
    displayName?: string;
    createdAt: Time;
    updatedAt: Time;
}
export interface PublicUserProfileInput {
    freeFireUid?: string;
    displayName?: string;
}
export type Time = bigint;
export interface PublicTournamentDetails {
    startTime: Time;
    name: string;
    createdAt: Time;
    maxParticipants?: bigint;
    entryFee: bigint;
}
export type TournamentId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminCreateTournament(name: string, entryFee: bigint, startTime: Time, maxParticipants: bigint | null): Promise<TournamentId>;
    adminCreditWallet(user: Principal, amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<PublicUserProfileView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWalletBalance(): Promise<bigint>;
    getTournamentDetails(tournamentId: TournamentId): Promise<PublicTournamentDetails>;
    getUserProfile(user: Principal): Promise<PublicUserProfileView | null>;
    getUserWalletBalance(user: Principal): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    joinTournament(tournamentId: TournamentId): Promise<void>;
    listTournaments(): Promise<Array<PublicTournamentDetails>>;
    saveCallerUserProfile(updatedProfile: PublicUserProfileInput): Promise<void>;
}
