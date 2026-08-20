"use client";

import { useCallback, useEffect, useState } from "react";
import { angolaLocationService } from "@/services/angola-location.service";
import type { AngolaProvince, AngolaProvinceMunicipality } from "@/types/dtos/angola-location.dto";
import { ANGOLA_PROVINCES_FALLBACK } from "@/constants/angola-provinces-fallback";

interface UseAngolaLocationReturn {
  provinces: AngolaProvince[];
  municipalities: AngolaProvinceMunicipality[];
  selectedProvinceSlug: string;
  selectedMunicipalitySlug: string;
  isLoading: boolean;
  error: string | null;
  /** true quando `provinces` veio da lista estática embutida, não da API ao vivo. */
  usingFallback: boolean;
  selectProvince: (slug: string) => void;
  selectMunicipality: (slug: string) => void;
  selectedProvinceName: string;
  selectedMunicipalityName: string;
}

export function useAngolaLocation(
  initialProvinceSlug = "",
  initialMunicipalitySlug = ""
): UseAngolaLocationReturn {
  const [provinces, setProvinces] = useState<AngolaProvince[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedProvinceSlug, setSelectedProvinceSlug] = useState(initialProvinceSlug);
  const [selectedMunicipalitySlug, setSelectedMunicipalitySlug] = useState(
    initialMunicipalitySlug
  );

  useEffect(() => {
    angolaLocationService
      .getProvinces()
      .then(setProvinces)
      .catch(() => {
        // API externa em baixo: usa a lista estática para a província continuar
        // a produzir um enum válido para o backend. Município (sem enum) cai
        // para texto livre no componente quando não há municípios disponíveis.
        setError("Sem ligação à lista oficial de províncias — a usar cópia offline.");
        setUsingFallback(true);
        setProvinces(ANGOLA_PROVINCES_FALLBACK);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const municipalities = angolaLocationService.getMunicipalities(
    provinces,
    selectedProvinceSlug
  );

  const selectProvince = useCallback((slug: string) => {
    setSelectedProvinceSlug(slug);
    setSelectedMunicipalitySlug("");
  }, []);

  const selectMunicipality = useCallback((slug: string) => {
    setSelectedMunicipalitySlug(slug);
  }, []);

  const selectedProvinceName =
    provinces.find((p) => p.slug === selectedProvinceSlug)?.nome ?? "";

  const selectedMunicipalityName =
    municipalities.find((m) => m.slug === selectedMunicipalitySlug)?.nome ?? "";

  return {
    provinces,
    municipalities,
    selectedProvinceSlug,
    selectedMunicipalitySlug,
    isLoading,
    error,
    usingFallback,
    selectProvince,
    selectMunicipality,
    selectedProvinceName,
    selectedMunicipalityName,
  };
}
