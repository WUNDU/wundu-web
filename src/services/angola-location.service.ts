import type { AngolaApiResponse, AngolaProvince } from "@/types/dtos/angola-location.dto";
import { ANGOLA_MUNICIPALITIES } from "@/constants/angola-municipalities";

const BASE_URL = "https://angolaprovinciasapi.ggwp.com.br/api/v1";

let provincesCache: AngolaProvince[] | null = null;
let inFlight: Promise<AngolaProvince[]> | null = null;

export const angolaLocationService = {
  async getProvinces(): Promise<AngolaProvince[]> {
    if (provincesCache) return provincesCache;
    if (inFlight) return inFlight;

    inFlight = fetch(`${BASE_URL}/provincias`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar províncias");
        return res.json() as Promise<AngolaApiResponse<AngolaProvince[]>>;
      })
      .then((json) => {
        provincesCache = json.data;
        return provincesCache;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  },

  getMunicipalities(provinces: AngolaProvince[], provinceSlug: string) {
    const found = provinces.find((p) => p.slug === provinceSlug);
    if (found?.municipios?.length) return found.municipios;
    // Sem municípios na resposta (API em baixo ou lista offline):
    // usa a cópia estática embutida.
    return (ANGOLA_MUNICIPALITIES[provinceSlug] ?? []).map((nome) => ({
      nome,
      slug: slugify(nome),
      distritos: [],
      comunas: [],
    }));
  },
};

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
