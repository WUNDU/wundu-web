export interface AngolaComuna {
  nome: string;
  slug: string;
}

export interface AngolaDistrict {
  nome: string;
  slug: string;
}

export interface AngolaProvinceMunicipality {
  nome: string;
  slug: string;
  distritos: AngolaDistrict[];
  comunas: AngolaComuna[];
}

export interface AngolaCapital {
  nome: string;
  slug: string;
}

export interface AngolaProvince {
  nome: string;
  slug: string;
  extensao: string;
  data_fundacao: string;
  capital: AngolaCapital;
  municipios: AngolaProvinceMunicipality[];
}

export interface AngolaApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

/**
 * O backend Wundu guarda `province` como enum (ex: "BENGO", "CUANDO_CUBANGO"),
 * que corresponde exactamente ao slug da API em maiúsculas com "_" no lugar de "-".
 */
export function provinceSlugToEnum(slug: string): string {
  return slug.toUpperCase().replace(/-/g, "_");
}

export function provinceEnumToSlug(value: string): string {
  return value.toLowerCase().replace(/_/g, "-");
}
