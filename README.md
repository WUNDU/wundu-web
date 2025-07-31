Wundu/
├── public/
│   ├── assets/               
# Imagens, ícones, etc.
│   └── fonts/                 
# Fontes customizadas
│
├── src/
│   ├── components/
│   │   ├── atoms/             
# Elementos básicos
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │
│   │   ├── molecules/         
# Combinação de atoms
│   │   │   └── InputGroup.tsx
│   │
│   │   ├── organisms/         
# Blocos maiores de UI
│   │   │   └── LoginForm.tsx
│   │
│   │   ├── templates/         
# Estrutura visual da página
│   │   │   └── AuthTemplate.tsx
│   │
│   │   └── pages/             
# Layout visual de páginas (sem lógica)
│   │       └── LoginPage.tsx
│
│   ├── containers/            
# Onde vai a lógica, hooks, APIs
│   │   └── LoginContainer.tsx
│
│   ├── styles/
│   │   ├── globals.css        
# Importa Tailwind aqui
│   │   ├── colors.ts          
# Paleta de cores
│   │   └── themes.ts          
# Se quiser temas dinâmicos
│
│   ├── hooks/
│   │   └── useAuth.ts
│
│   ├── contexts/
│   │   └── AuthContext.tsx
│
│   ├── lib/
│   │   └── api.ts             
# Configuração de Axios, etc.
│
│   ├── constants/
│   │   └── routes.ts
│
│   └── types/
│       └── user.ts
│
├── tailwind.config.js         
# Configura cores customizadas aqui
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── .env
