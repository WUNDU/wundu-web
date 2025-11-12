# Sistema de Validação Inteligente de Senhas

## Visão Geral

Sistema completo de validação de senhas que fornece feedback em tempo real sobre critérios específicos, similar aos melhores sites do mercado.

## Componentes

### 1. Validação (utils/validation.ts)

```typescript
// Validação simples (mantida para compatibilidade)
validatePassword(password: string): boolean

// Validação detalhada (nova)
validatePasswordDetailed(password: string): PasswordValidation
```

### 2. Componentes UI

#### PasswordValidationFeedback
- **Uso**: Registro de usuários, alteração de senhas
- **Funcionalidade**: Lista completa de critérios com status visual
- **Localização**: `src/ui/molecules/PasswordValidation`

#### PasswordStrength  
- **Uso**: Login, campos de senha secundários
- **Funcionalidade**: Barra de progresso e força da senha
- **Localização**: `src/ui/molecules/PasswordStrength`

## Critérios de Validação

1. **Comprimento**: 8-12 caracteres
2. **Minúscula**: Pelo menos uma letra (a-z)
3. **Maiúscula**: Pelo menos uma letra (A-Z)  
4. **Número**: Pelo menos um dígito (0-9)
5. **Especial**: Pelo menos um caractere (@$!%*?&)

## Exemplos de Uso

### Registro (Validação Completa)
```tsx
import { PasswordValidationFeedback } from "@/ui/molecules";
import { validatePasswordDetailed } from "@/utils/validation";

const RegisterForm = () => {
  const [password, setPassword] = useState("");
  const validation = validatePasswordDetailed(password);

  return (
    <div>
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordValidationFeedback 
        validation={validation}
        showCriteria={password.length > 0}
      />
    </div>
  );
};
```

### Login (Validação Simples)
```tsx
import { PasswordStrength } from "@/ui/molecules";
import { validatePasswordDetailed } from "@/utils/validation";

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const validation = validatePasswordDetailed(password);

  return (
    <div>
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrength 
        validation={validation}
        showStrength={password.length > 0}
      />
    </div>
  );
};
```

## Integração com Hooks

### useSecurityData (Exemplo Implementado)
```typescript
const setField = (field: keyof SecurityFormState, value: string) => {
  setForm((prev) => ({ ...prev, [field]: value }));
  
  if (field === "password") {
    setPasswordValidation(validatePasswordDetailed(value));
    setPasswordError(""); // Limpa erros ao digitar
  }
};
```

## Benefícios

✅ **Feedback em tempo real** - Usuário vê critérios sendo atendidos  
✅ **UX intuitiva** - Visual claro com cores e ícones  
✅ **Flexível** - Dois componentes para diferentes contextos  
✅ **Reutilizável** - Fácil integração em qualquer formulário  
✅ **Acessível** - Mensagens claras e estrutura semântica  

## Próximos Passos

- [ ] Adicionar suporte a internacionalização (i18n)
- [ ] Implementar validação de senhas comprometidas
- [ ] Adicionar sugestões de senhas fortes
- [ ] Integrar com bibliotecas de força de senha (zxcvbn)
