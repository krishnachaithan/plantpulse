import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DiagnosisResult, UserWithDiagnoses } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetDiagnosisHistory(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<DiagnosisResult[]>({
    queryKey: ["diagnosisHistory", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getDiagnosisHistory(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useAnalyzePlantImage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      imageBytes,
    }: { imageBytes: Uint8Array<ArrayBuffer> }) => {
      if (!actor) throw new Error("Actor not ready");
      const blob = ExternalBlob.fromBytes(imageBytes);
      return actor.analyzePlantImage(blob);
    },
  });
}

export function useClearDiagnosisHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.clearDiagnosisHistory(principal);
    },
    onSuccess: (_data, principal) => {
      queryClient.invalidateQueries({
        queryKey: ["diagnosisHistory", principal.toString()],
      });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsersDiagnoses() {
  const { actor, isFetching } = useActor();
  return useQuery<UserWithDiagnoses[]>({
    queryKey: ["allUsersDiagnoses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsersDiagnoses();
    },
    enabled: !!actor && !isFetching,
  });
}
