import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface DiagnosisResult {
    pesticideRecommendations: Array<string>;
    fertilizerRecommendations: Array<string>;
    plantName: string;
    healthStatus: HealthStatus;
    timestamp: Time;
    conditions: Array<string>;
    image?: ExternalBlob;
    careTips: Array<string>;
}
export type Time = bigint;
export interface UserWithDiagnoses {
    user: Principal;
    diagnoses: Array<DiagnosisResult>;
    profile?: UserProfile;
}
export interface UserProfile {
    name: string;
}
export enum HealthStatus {
    mild = "mild",
    healthy = "healthy",
    severe = "severe",
    moderate = "moderate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDiagnosis(plantName: string, healthStatus: HealthStatus, conditions: Array<string>, fertilizerRecommendations: Array<string>, pesticideRecommendations: Array<string>, careTips: Array<string>, image: ExternalBlob | null): Promise<void>;
    analyzePlantImage(image: ExternalBlob): Promise<DiagnosisResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearDiagnosisHistory(target: Principal): Promise<void>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAllUsersDiagnoses(): Promise<Array<UserWithDiagnoses>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDiagnosisHistory(target: Principal): Promise<Array<DiagnosisResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
