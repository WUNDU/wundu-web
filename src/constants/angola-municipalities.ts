/**
 * Municípios por província (fallback offline).
 *
 * Fonte: dataset público arseniomuanda/angola (2019, 18 províncias).
 * As províncias criadas na reorganização de 2024 (Cuando, Cubango,
 * Moxico Leste, Icolo e Bengo) herdam a lista da província de origem —
 * o backend guarda o município como texto livre, por isso a lista
 * serve como sugestão no seletor.
 */
export const ANGOLA_MUNICIPALITIES: Record<string, string[]> = {
  "bengo": ["Ambriz", "Bula Atumba", "Caxito", "Dande", "Dembos", "Nambuangongo", "Piri", "Zala"],
  "benguela": ["Balombo", "Baía Farta", "Benguela", "Bocoio", "Caimbambo", "Catumbela", "Chorongói", "Cubal", "Ganda", "Lobito"],
  "bie": ["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Kuito", "Nharea"],
  "cabinda": ["Belize", "Buco-Zau", "Cabinda", "Cacongo"],
  "cuando": ["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Mavinga", "Menongue", "Nancova", "Rivungo"],
  "cuanza-norte": ["Ambaca", "Banga", "Bolongongo", "Cazengo", "Dondo", "Golungo Alto", "Lucala", "Ngonguembo", "Quiculungo", "Samba Cajú"],
  "cuanza-sul": ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Libolo", "Mussende", "Porto Amboim", "Quibala", "Quilenda", "Seles", "Sumbe"],
  "cubango": ["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Mavinga", "Menongue", "Nancova", "Rivungo"],
  "cunene": ["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
  "huambo": ["Bailundo", "Catchiungo", "Caála", "Ekunha", "Huambo", "Londuimbale", "Longojo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ucama"],
  "huila": ["Caconda", "Cacula", "Caluquembe", "Chiange", "Chicomba", "Chipindo", "Cuvango", "Humpata", "Jamba", "Lubango", "Matala", "Quipungo"],
  "icolo-e-bengo": ["Belas", "Cacuaco", "Cazenga", "Luanda", "Quiçama", "Viana", "Ícolo e Bengo"],
  "luanda": ["Belas", "Cacuaco", "Cazenga", "Luanda", "Quiçama", "Viana", "Ícolo e Bengo"],
  "lunda-norte": ["Cambulo", "Cangula", "Capenda-Camulemba", "Chitato", "Cuango", "Cuílo", "Lubalo", "Lucapa", "Lóvua", "Xá-Muteba"],
  "lunda-sul": ["Cacolo", "Dala", "Muconda", "Saurimo"],
  "malanje": ["Cabundi-Catembo", "Cangandala", "Caombo", "Cunda-Dia-Baze", "Kakuso", "Kalandula", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quirima"],
  "moxico": ["Alto Zambeze", "Bundas", "Cameia", "Camongue", "Luacano", "Luau", "Luchazes", "Luena", "Léua"],
  "moxico-leste": ["Alto Zambeze", "Bundas", "Cameia", "Camongue", "Luacano", "Luau", "Luchazes", "Luena", "Léua"],
  "namibe": ["Bibala", "Camacuio", "Namibe", "Tômbua", "Virei"],
  "uige": ["Ambuíla", "Buengas", "Bumbe", "Bungo", "Cangola", "Damba", "Maquela do Zombo", "Mucaba", "Negaje", "Quimbele", "Quitexe", "Santa Cruz", "Sanza Pombo", "Songo", "Uíge"],
  "zaire": ["Cuimba", "M'Banza Congo", "Nzeto", "Nóqui", "Soyo", "Tomboco"],
};
