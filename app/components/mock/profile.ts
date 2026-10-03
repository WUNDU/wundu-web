export interface ProfileDTO {
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  address: string;
  country: string;
  /** Foto em object URL (upload local); nulo = avatar por omissão. */
  photo?: string | null;
  province?: string;
  municipality?: string;
}

export const mockProfile: ProfileDTO = {
  name: "Domingos Kandembe",
  email: "do.kandembe@wundu.tech",
  birthDate: "27/08/2008",
  phone: "+244 914 939 238",
  address: "Av. 21 de Janeiro",
  country: "Angola",
};

export const COUNTRY_OPTIONS = [
  "Angola",
  "Portugal",
  "Brasil",
  "Moçambique",
  "Cabo Verde",
];
