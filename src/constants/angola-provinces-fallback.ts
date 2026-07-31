import type { AngolaProvince } from "@/types/dtos/angola-location.dto";
import { provinceEnumToSlug } from "@/types/dtos/angola-location.dto";

/**
 * Cópia estática (nome/slug) das províncias de Angola, usada só quando a API
 * pública angolaprovinciasapi está inacessível. Mantém o picker de província
 * a produzir sempre um enum válido para o backend — nunca degrada para texto
 * livre nesse campo, porque o backend valida `province` contra um enum fixo.
 * Município não tem essa restrição, por isso nesse modo cai para texto livre
 * (não temos os municípios completos offline).
 *
 * Reflecte a reorganização administrativa de 2024 (21 províncias): Cuando
 * Cubango dividiu-se em "Cubango"+"Cuando", Moxico em "Moxico"+"Moxico Leste",
 * e "Icolo e Bengo" passou a província própria. Se o enum do backend ainda for
 * o esquema antigo (18 províncias), estes 4 slugs vão dar 400 "enum inválido".
 */
export const ANGOLA_PROVINCES_FALLBACK: AngolaProvince[] = [
  "Bengo|bengo",
  "Benguela|benguela",
  "Bié|bie",
  "Cabinda|cabinda",
  "Cubango|cubango",
  "Cuanza Norte|cuanza-norte",
  "Cuanza Sul|cuanza-sul",
  "Cunene|cunene",
  "Huambo|huambo",
  "Huíla|huila",
  "Luanda|luanda",
  "Lunda Norte|lunda-norte",
  "Lunda Sul|lunda-sul",
  "Malanje|malanje",
  "Moxico|moxico",
  "Namibe|namibe",
  "Uíge|uige",
  "Zaire|zaire",
  "Moxico Leste|moxico-leste",
  "Cuando|cuando",
  "Icolo e Bengo|icolo-e-bengo",
].map((entry) => {
  const [nome, slug] = entry.split("|");
  return {
    nome,
    slug,
    extensao: "",
    data_fundacao: "",
    capital: { nome: "", slug: "" },
    municipios: [],
  };
});

/** Slugs introduzidos na reorganização de 2024 — podem não existir no enum do backend ainda. */
export const NEW_PROVINCE_SLUGS = new Set([
  "cubango",
  "cuando",
  "moxico-leste",
  "icolo-e-bengo",
]);

/** Nome legível a partir do enum guardado (ex: "CUANZA_SUL" → "Cuanza Sul"). Usa a lista estática só como dicionário de nomes — não depende da API estar disponível. */
export function provinceEnumToLabel(enumValue: string): string {
  const slug = provinceEnumToSlug(enumValue);
  return ANGOLA_PROVINCES_FALLBACK.find((p) => p.slug === slug)?.nome ?? enumValue;
}
