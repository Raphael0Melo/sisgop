// Tipos básicos para o sistema BPA

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  user: People | null;
  isLoged: boolean;
  signIn: (cpf: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
}

export interface BookDays {
  _id: string;
  data_final: string;
  data_inicial: string;
  graduacao_antecessor: string,
  graduacao_relator: string
  graduacao_sucessor: string;
  nome_completo_relator: string;
  nome_guerra_antecessor: string;
  nome_guerra_relator: string;
  nome_guerra_sucessor: string;
  numero_parte: string;
  quarto_hora: string;
  rg_realtor: string;
  tipo_servico: string;
  turno: string;
  unidade: string;
  status: string;
}

export interface BookDaysAll {
  _id: string;
  data_final: string;
  data_inicial: string;
  graduacao_antecessor: {
    _id: string;
    name_graduation: string;
    sigla_graduation: string,
    group: string
  }
  graduacao_relator: {
    _id: string;
    name_graduation: string;
    sigla_graduation: string,
    group: string
  }
  graduacao_sucessor: {
    _id: string;
    name_graduation: string;
    sigla_graduation: string,
    group: string
  }
  nome_completo_relator: string;
  nome_guerra_antecessor: string;
  nome_guerra_relator: string;
  nome_guerra_sucessor: string;
  numero_parte: string;
  quarto_hora: string;
  rg_realtor: string;
  tipo_servico: string;
  turno: string;
  unidade: {
    _id: string;
    name_unity: string;
    sigla_unity: string
  }
  status: string;
  administrativeOccurrences: AdmOccurrences[];
  operationalOccurrences: OpOccurrences[];
  gather: Gathers[];
  barracksCharge: BarracksChanges[];
}

export interface BarracksChanges {
  _id: string
  id_livro: string
  prefixo: string
  informacao: string
}

export interface AdmOccurrences {
  _id: string
  id_livro: string
  prefixo: string
  informacao: string
}

export interface OpOccurrences {
  _id: string
  id_livro: string
  prefixo: string
  informacao: string
}

export interface Gathers {
  _id: string
  id_livro: string
  prefixo: string
  informacao: string
}

export interface Productivitys {
  _id: string;
  data_final: string;
  data_inicial: string;
  graduacao_comandante_btl: string;
  graduacao_comandante_coint: string;
  graduacao_oficial_dia: string;
  graduacao_subComandante_btl: string;
  hora_final: string;
  hora_inicial: string;
  nome_comandante_btl: string;
  nome_comandante_coint: string;
  nome_completo: string;
  nome_oficial_dia: string;
  nome_subComandante_btl: string;
  rg: string;
  servico: string;
  turno: string;
  unidade: string;
}

export interface MapForce {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Operation {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ControlCar {
  _id: string;
  data_entrada: string;
  data_nascimento: string;
  data_saida: string;
  nome: string;
  obs: string;
  placa: string;
  setor: string;
  tipo_veiculo: string;
}

export interface People {
  _id: string,
  nome: string,
  email: string,
  rg: string,
  cpf: string,
  nome_guerra: string,
  senha: string,
  graduacao: {
    _id: string,
    name_graduation: string,
    sigla_graduation: string
    group: string
  },
  sexo: string,
  data_nascimento: string,
  telefone: string,
  img_path: string,
  unidade: {
    _id: string,
    name_unity: string,
    sigla_unity: string
  },
  situacao: {
    _id: string,
    name_situation: string
  },
  perfil: {
    _id: string,
    name_profile: string,
    permissions: string[]
  },
  status: string
}

export interface Unitys {
  _id: string,
  name_unity: string,
  sigla_unity: string,
  level: string,
}

export interface Situations {
  _id: string,
  name_situation: string,
  group: string,
}

export interface Profiles {
  _id: string,
  name_profile: string,
  permissions: string[],
  level: string,
}

export interface Permission {
  _id: string,
  name: string,
  group: string,
}

export interface Graduations {
  _id: string,
  name_graduation: string,
  sigla_graduation: string,
  level: string,
  group: string
}

export interface Assessment {
  _id: string;
  operation: string;
  disk_report: string;
  date: Date;
  latitude: string;
  longitude: string;
  city: string;
  location: string;
  number_assessment: string;
  term_seizure: string;
  term_embargo: string;
  term_realease: string;
  term_deposit: string;
  type_action: string;
  number_document: string;
  inspection_agent: string;
  summary: string;
  fine: string;
  year: string;
  number_process: string,
  status: string;
}

export interface BookDay extends Omit<BookDays, '_id'> {
  id: string;
}

export interface Productivity extends Omit<Productitys, '_id'> {
  id: string;
}

export interface ControlCarFirestore extends Omit<ControlCar, '_id'> {
  id: string;
}