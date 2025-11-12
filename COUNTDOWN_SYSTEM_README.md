# Sistema de Contagem Regressiva - Lançamento Wundu

## Visão Geral

Sistema completo de contagem regressiva para o lançamento do Wundu em **19 de novembro de 2025**. Controla a disponibilidade dos botões de login/registro e exibe uma experiência visual atraente em tempo real.

## Data de Lançamento
📅 **19 de Novembro de 2025 às 00:00**

## Componentes Criados

### 1. Hook `useCountdown`
**Localização**: `src/hooks/useCountdown.ts`

```typescript
const { timeLeft, isLaunched, isLoading } = useCountdown(targetDate);
```

**Funcionalidades**:
- ⏰ Atualização em tempo real (1 segundo)
- 🚀 Detecção automática de lançamento
- 💧 Prevenção de hydration mismatch
- 📊 Retorna dias, horas, minutos, segundos

### 2. Componente `CountdownTimer`
**Localização**: `src/ui/molecules/CountdownTimer`

**Características**:
- 🎨 Design visual atraente com gradientes
- ⚡ Animações suaves e efeitos hover
- 📱 Responsivo (mobile-first)
- 🎯 Estados: loading, contando, lançado

**Visual**:
- Cartões coloridos para cada unidade de tempo
- Animação de fade-in escalonada
- Efeito de pulso para criar expectativa
- Celebração visual quando lançado

### 3. Componente `LaunchButtons`
**Localização**: `src/ui/molecules/LaunchButtons`

**Estados**:

#### Antes do Lançamento:
- ❌ Botões desabilitados (Login/Registro)
- 💡 Tooltips explicativos
- 🔔 Botão "Me avise quando lançar"

#### Após o Lançamento:
- ✅ Botões ativos com links funcionais
- 🎨 Gradientes e animações hover
- 🆕 Badge "NOVO!" animado

## Integração na Landing Page

### Comportamento Condicional:

#### **Antes do Lançamento:**
- 🎯 Título: "Finanças está chegando"
- ⏳ Contagem regressiva visível
- 🔒 Botões desabilitados
- 📋 Seção "O que você pode esperar"

#### **Após o Lançamento:**
- 🎉 Título: "Finanças começa aqui"
- ✨ Celebração visual
- 🚀 Botões ativos
- 📱 Seções completas da aplicação

## Exemplo de Uso

```tsx
import { CountdownTimer, LaunchButtons } from "@/ui/molecules";
import { useCountdown } from "@/hooks/useCountdown";

const MyComponent = () => {
  const launchDate = new Date('2025-11-19T00:00:00');
  const { isLaunched, isLoading } = useCountdown(launchDate);

  return (
    <div>
      <CountdownTimer 
        targetDate={launchDate}
        title="Lançamento em breve"
        subtitle="Algo incrível está chegando"
      />
      <LaunchButtons 
        isLaunched={isLaunched} 
        isLoading={isLoading} 
      />
    </div>
  );
};
```

## Características Técnicas

### Performance:
- ⚡ Atualização otimizada (apenas quando necessário)
- 🔄 Cleanup automático de timers
- 💾 Estado local para evitar re-renders

### Acessibilidade:
- 🎯 Estrutura semântica
- 📱 Design responsivo
- 🔤 Textos descritivos claros

### UX/UI:
- 🎨 Animações suaves e profissionais
- 🌈 Gradientes modernos
- 📐 Layout consistente
- 🎭 Estados visuais claros

## Cronograma Visual

```
Hoje ────────────────────── 19/Nov/2025
 ↓                              ↓
🔒 Botões desabilitados    →    🚀 Sistema ativo
⏳ Contagem regressiva     →    🎉 Celebração
📋 Preview de features     →    📱 App completo
```

## Benefícios

✅ **Marketing**: Cria expectativa e engajamento  
✅ **UX**: Experiência clara e intuitiva  
✅ **Técnico**: Sistema robusto e reutilizável  
✅ **Visual**: Design moderno e atraente  
✅ **Funcional**: Controle preciso de acesso  

## Próximos Passos

- [ ] Integrar com sistema de notificações
- [ ] Adicionar analytics de engajamento
- [ ] Implementar newsletter de pré-lançamento
- [ ] Criar landing pages específicas por feature

---

🚀 **Sistema pronto para o lançamento em 19 de novembro de 2025!**
