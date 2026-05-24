export type Recipe = {
  product: string;
  recipe: string;
  active_ingredient: string;
  category: string;
  func: string;
  application: string;
  notes: string;
  image?: string;
  duration?: string;
  difficulty?: 'Fácil' | 'Médio' | 'Avançado';
  massageTime?: string;
};

export type Chemistry = {
  name: string;
  alias: string;
  className: string;
  func: string;
  applications: string;
  safety: string;
  image?: string;
  molecularFormula?: string;
};

export type Procedure = {
  title: string;
  icon: any;
  content: string;
  steps?: string[];
  tips?: string[];
  duration?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  level: 'Fácil' | 'Médio' | 'Avançado';
  videoUrl?: string;
  videoThumbnail?: string;
  content?: string;
  steps?: string[];
};

export type EPI = {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  importance: 'Crítico' | 'Alto' | 'Médio';
  usage: string;
  image?: string;
  maintenanceTips?: string[];
};

export type SafetyTip = {
  id: string;
  title: string;
  icon: string;
  description: string;
  severity: 'Crítico' | 'Alto' | 'Médio';
  details?: string;
  preventionSteps?: string[];
};

export type GuideCategory =
  | 'produtos'
  | 'quimica'
  | 'procedimentos'
  | 'seguranca'
  | 'epis'
  | 'tutorial'
  | 'receita';

export const defaultRecipes: Recipe[] = [
  {
    product: 'FOX XPRO',
    recipe: 'Triple Action',
    active_ingredient: 'Trifloxystrobin + Prothioconazole + Bixafen',
    category: 'Fungicida Sistêmico Avançado',
    func: 'Controle de doenças foliares com tecnologia Leafshield',
    application: 'Pulverização foliar (8-10 min)',
    notes:
      'Tecnologia exclusiva que garante absorção rápida e proteção prolongada. Ideal para culturas de alto valor.',
    duration: '8-10',
    difficulty: 'Intermediário',
  },
  {
    product: 'NATIVO WG 75',
    recipe: 'Dual Action',
    active_ingredient: 'Tebuconazole (50%) + Trifloxystrobin (25%)',
    category: 'Fungicida Preventivo',
    func: 'Proteção preventiva e curativa com duplo mecanismo',
    application: 'Pulverização (6-8 min)',
    notes: 'Granulado dispersível em água. Combinação sinérgica para máxima eficácia.',
    duration: '6-8',
    difficulty: 'Intermediário',
  },
  {
    product: 'TEBUCONAZOLE',
    recipe: 'Standard Formulation',
    active_ingredient: 'Tebuconazole 100%',
    category: 'Fungicida Triazol',
    func: 'Proteção contra oídio e rust',
    application: 'Aplicação sistêmica',
    notes: 'Produto versátil com excelente absorção foliar.',
    duration: '6-8',
    difficulty: 'Fácil',
    massageTime: '6-8 minutos',
  },
  {
    product: 'TEBUCONAZOLE B',
    recipe: 'Enhanced Formula',
    active_ingredient: 'Tebuconazole + Adjuvante',
    category: 'Fungicida Triazol Premium',
    func: 'Proteção aprimorada com melhor aderência',
    application: 'Aplicação com espalhante',
    notes: 'Formulação melhorada com adjuvante que aumenta a aderência foliar.',
    duration: '7-9',
    difficulty: 'Intermediário',
    massageTime: '7-9 minutos',
  },
  {
    product: 'TRIFLOXY',
    recipe: 'Strobilurin Premium',
    active_ingredient: 'Trifloxystrobin 100%',
    category: 'Fungicida Estrobilurina',
    func: 'Controle de múltiplas doenças com excelente cobertura',
    application: 'Pulverização foliar',
    notes: 'Ótima cobertura foliar. Resistente à chuva após 2 horas.',
    duration: '8-10',
    difficulty: 'Iniciante',
    massageTime: '6 minutos e 40 segundos',
  },
  {
    product: 'UREIA',
    recipe: 'Nitrogen Source',
    active_ingredient: 'Ureia 46%',
    category: 'Fertilizante Nitrogenado',
    func: 'Fonte de nitrogênio para nutrição foliar',
    application: 'Fertirrigação',
    notes: 'Altamente solúvel e de rápida absorção.',
    duration: '5-7',
    difficulty: 'Fácil',
    massageTime: 'A cronometrar',
  },
];

export const defaultChemistry: Chemistry[] = [
  {
    name: 'Trifloxystrobin',
    alias: 'Strobilurin de última geração',
    className: 'QoI (Quinona externa inibidora)',
    func: 'Inibição da respiração mitocondrial, bloqueando a produção de energia do fungo',
    applications: 'Fungicida foliar para controle de oídio, ferrugem e antracnose',
    safety: 'Categoria toxicológica 5 (produto pouco tóxico). Evitar contato ocular prolongado.',
    molecularFormula: 'C20H19F3N2O4',
  },
  {
    name: 'Tebuconazole',
    alias: 'Triazol sistêmico',
    className: 'DMI (Demetilação inibidor)',
    func: 'Inibição da biossíntese de ergosterol, essencial para membrana celular do fungo',
    applications: 'Proteção preventiva e curativa em diversas culturas',
    safety: 'Classe III - medianamente tóxico. Evitar inalação do pó.',
    molecularFormula: 'C16H22ClN3O',
  },
  {
    name: 'Prothioconazole',
    alias: 'Triazol Avançado',
    className: 'DMI (Demetilação inibidor)',
    func: 'Inibição de ergosterol + propriedades anti-transpiração',
    applications: 'Fungicida sistêmico para doenças de final de ciclo',
    safety: 'Baixa toxicidade para mamíferos. Seguro em aplicação foliar.',
    molecularFormula: 'C14H15Cl2N3O',
  },
  {
    name: 'Bixafen',
    alias: 'Carboxamida moderna',
    className: 'SDHI (Succinate dehydrogenase inhibitor)',
    func: 'Inibição do complexo II mitocondrial, interrompendo o ciclo de Krebs',
    applications: 'Controle de ferrugem e manchas foliares resistentes a QoI',
    safety: 'Toxicidade aguda baixa. Biodegradável no solo.',
    molecularFormula: 'C18H12Cl2F3N3O',
  },
];

export const defaultProcedures: Procedure[] = [
  {
    title: 'Preparação do Equipamento',
    icon: 'cog',
    content: 'Inspeção completa do massageador industrial antes do uso',
    steps: [
      'Inspecione visualmente todas as partes do equipamento',
      'Verifique se o equipamento está limpo e sem resíduos',
      'Valide conectores, mangueiras e vedações',
      'Teste funcionamento básico em modo vazio por 30 segundos',
      'Documente a inspeção no formulário de checklist',
    ],
    tips: [
      'Use EPI completo durante a inspeção',
      'Nunca opere com ruídos anormais',
      'Lubrifique conforme manual do fabricante',
    ],
    duration: '10-15',
  },
  {
    title: 'Carregamento de Ingredientes',
    icon: 'flask',
    content: 'Processo seguro de adição de matérias-primas',
    steps: [
      'Pesar cada ingrediente conforme receita técnica',
      'Conferir datas de validade e lotes',
      'Adicionar na sequência correta (líquidos primeiro, depois sólidos)',
      'Usar EPI completo durante todo o processo',
      'Manter registro de lote para rastreabilidade',
      'Verificar compatibilidade química antes da mistura',
    ],
    tips: [
      'Sempre use balanças calibradas',
      'Evite contaminação cruzada',
      'Registre qualquer anomalia imediatamente',
    ],
    duration: '15-20',
  },
  {
    title: 'Ciclo de Massagem',
    icon: 'play-circle',
    content: 'Processo de homogeneização da formulação',
    steps: [
      'Inicie o ciclo seguindo os parâmetros da receita',
      'Monitore temperatura constantemente (não exceder 40°C)',
      'Observe a homogeneidade visual da mistura',
      'Cronometro ativo - respeite o tempo determinado',
      'Abra apenas após confirmação de homogeneidade completa',
      'Documente os parâmetros do ciclo',
    ],
    tips: [
      'Nunca abra antes do tempo',
      'Use sensor de temperatura digital',
      'Faça pausas se necessário para evitar superaquecimento',
    ],
    duration: '8-12',
  },
  {
    title: 'Verificação de Qualidade',
    icon: 'checkmark-circle',
    content: 'Controles de qualidade da formulação final',
    steps: [
      'Inspecione visualmente cores e aspecto',
      'Teste consistência/viscosidade',
      'Valide pH conforme especificação (5.5-7.0)',
      'Teste dispersibilidade em água',
      'Documente todos os resultados no relatório',
      'Aprove ou rejeite conforme critérios',
    ],
    tips: [
      'Use equipamentos calibrados',
      'Compare com amostra padrão',
      'Em caso de dúvida, rejeite o lote',
    ],
    duration: '10-15',
  },
  {
    title: 'Descarga e Embalagem',
    icon: 'archive',
    content: 'Transferência e acondicionamento do produto final',
    steps: [
      'Descarregue com cuidado usando sistema fechado',
      'Use EPI apropriado para evitar contato',
      'Etiquete corretamente com lote e validade',
      'Armazene em local fresco e arejado',
      'Registre saída no sistema de inventário',
      'Limpe o equipamento imediatamente após uso',
    ],
    tips: [
      'Evite respingos e derramamentos',
      'Recipientes devem estar limpos e secos',
      'Documente qualquer perda de produto',
    ],
    duration: '15-20',
  },
];

export const defaultTutorials: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'Integração de Sistema',
    icon: 'play-circle',
    description: 'Aprenda como integrar e utilizar o sistema de formulação agrícola',
    duration: '15 min',
    level: 'Fácil',
    videoUrl: 'https://www.youtube.com/watch?v=bRz-CJert2E',
    videoThumbnail: 'https://img.youtube.com/vi/bRz-CJert2E/maxresdefault.jpg',
    content:
      'Neste tutorial, você aprenderá os princípios fundamentais de integração do sistema, tipos de formulações e como começar a utilizar a plataforma.',
    steps: [
      'Entender os componentes do sistema',
      'Conhecer o fluxo de trabalho',
      'Aprender sobre integração de dados',
      'Praticar com um exemplo simples',
    ],
  },
  {
    id: 'tut-2',
    title: 'Técnicas Avançadas de Massagem',
    icon: 'fitness',
    description: 'Dominar as técnicas profissionais de homogeneização',
    duration: '25 min',
    level: 'Avançado',
    content:
      'Tutorial completo sobre técnicas avançadas de massagem, incluindo parâmetros otimizados e troubleshooting.',
    steps: [
      'Preparar o equipamento adequadamente',
      'Monitorar parâmetros em tempo real',
      'Ajustar velocidade e temperatura',
      'Documentar e validar resultados',
    ],
  },
  {
    id: 'tut-3',
    title: 'Controle de Qualidade',
    icon: 'checkmark-circle',
    description: 'Aprender a realizar verificações de qualidade adequadamente',
    duration: '18 min',
    level: 'Intermediário',
    content:
      'Guia passo a passo para realizar controles de qualidade efetivos e documentar resultados.',
    steps: [
      'Coletar amostras corretamente',
      'Realizar testes visuais',
      'Medir parâmetros críticos',
      'Documentar e arquivar resultados',
    ],
  },
];

export const defaultEPIs: EPI[] = [
  {
    id: 'epi-1',
    name: 'Capacete de Segurança',
    icon: 'shield-outline',
    category: 'Proteção da Cabeça',
    description: 'Proteção contra impactos e quedas de objetos',
    importance: 'Crítico',
    usage: 'Usar durante todas as operações na área de produção e estoque',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F52e0643ca5ed4535918a276cbd09d143%2F00981bcba8e942f6ace8f37987c69488?format=webp&width=400&height=400',
    maintenanceTips: [
      'Inspecionar por rachaduras ou danos',
      'Verificar função da jugular',
      'Substituir conforme regulamentação',
    ],
  },
  {
    id: 'epi-2',
    name: 'Óculos de Proteção',
    icon: 'eye-outline',
    category: 'Proteção Ocular',
    description: 'Proteção dos olhos contra respingos, pós e partículas',
    importance: 'Crítico',
    usage: 'Usar durante todas as operações que envolvam líquidos ou pós',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F52e0643ca5ed4535918a276cbd09d143%2Fe933a5f2d8254cea8b9c803cd5565fb5?format=webp&width=400&height=400',
    maintenanceTips: [
      'Limpar regularmente com pano macio',
      'Inspecionar lentes por danos',
      'Armazenar em case apropriado',
      'Substituir se houver riscos',
    ],
  },
  {
    id: 'epi-3',
    name: 'Protetor Auricular',
    icon: 'volume-mute-outline',
    category: 'Proteção Auditiva',
    description: 'Proteção contra ruído excessivo de máquinas',
    importance: 'Alto',
    usage: 'Usar durante operação de equipamentos de alta potência',
    image:
      'https://cdn.builder.io/api/v1/image/assets%2F52e0643ca5ed4535918a276cbd09d143%2F13b88453b5184722a3e3e8d9b4341ea0?format=webp&width=400&height=400',
    maintenanceTips: [
      'Verificar vedação regularmente',
      'Lavar com água e sabão',
      'Trocar espumas quando necessário',
    ],
  },
  {
    id: 'epi-4',
    name: 'Luvas de Proteção',
    icon: 'hand-left-outline',
    category: 'Proteção das Mãos',
    description: 'Proteção contra contato com produtos químicos e abrasivos',
    importance: 'Crítico',
    usage: 'Usar em todas as operações de manipulação de produtos',
    maintenanceTips: [
      'Verificar integridade antes de usar',
      'Trocar se houver perfurações',
      'Descartar adequadamente após uso',
    ],
  },
  {
    id: 'epi-5',
    name: 'Avental Impermeável',
    icon: 'shirt-outline',
    category: 'Proteção do Corpo',
    description: 'Proteção do vestiário contra respingos e contaminação',
    importance: 'Alto',
    usage: 'Usar durante preparação, carregamento e descarga de produtos',
    maintenanceTips: [
      'Lavar regularmente',
      'Inspecionar por desgaste',
      'Secar completamente antes de guardar',
    ],
  },
];

export const defaultSafetyTips: SafetyTip[] = [
  {
    id: 'safe-1',
    title: 'Intoxicação por Inalação',
    icon: 'alert-circle-outline',
    description: 'Exposição prolongada a pós ou vapores pode causar irritação respiratória',
    severity: 'Crítico',
    preventionSteps: [
      'Usar máscara de proteção adequada',
      'Garantir boa ventilação na área',
      'Limitar tempo de exposição',
      'Fazer pausas frequentes',
    ],
  },
  {
    id: 'safe-2',
    title: 'Contato com Pele',
    icon: 'alert-outline',
    description: 'Alguns produtos podem causar irritação ou reações alérgicas na pele',
    severity: 'Alto',
    preventionSteps: [
      'Usar luvas impermeáveis',
      'Lavar mãos após qualquer contato',
      'Trocar roupas contaminadas imediatamente',
      'Reportar qualquer reação anormal',
    ],
  },
  {
    id: 'safe-3',
    title: 'Derramamento de Produtos',
    icon: 'water-outline',
    description: 'Derramamentos podem contaminar superfícies e criar riscos de escorregamento',
    severity: 'Alto',
    preventionSteps: [
      'Limpar imediatamente com absorbente',
      'Descartar conforme protocolo',
      'Avisar colegas sobre área molhada',
      'Verificar se houve contaminação',
    ],
  },
  {
    id: 'safe-4',
    title: 'Sobrecarga do Equipamento',
    icon: 'flash-outline',
    description: 'Operação incorreta pode danificar o equipamento ou causar superaquecimento',
    severity: 'Crítico',
    preventionSteps: [
      'Respeitar limites de capacidade',
      'Monitorar temperatura constantemente',
      'Fazer pausas entre ciclos',
      'Realizar manutenção preventiva',
    ],
  },
  {
    id: 'safe-5',
    title: 'Reação Química Inesperada',
    icon: 'flask-outline',
    description: 'Mistura incorreta de ingredientes pode resultar em reações exotérmicas',
    severity: 'Crítico',
    preventionSteps: [
      'Seguir exatamente a sequência de adição',
      'Verificar compatibilidade de ingredientes',
      'Adicionar lentamente',
      'Manter distância da mistura',
    ],
  },
];
