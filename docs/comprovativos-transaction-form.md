# Comprovativos no Formulário de Transação

> [← Voltar ao índice](README.md) | Porta do fluxo de comprovativos do protótipo `wundu` para o novo visual.

## Princípio

Tudo o que toca em comprovativos no protótipo `wundu` foi portado tal e qual:

| Protótipo (`wundu`) | `wundu-web` (novo visual) |
|---|---|
| `receipt-entry-mode` (tab dentro da secção de valor) | `app/components/transaction/EntryModeTabs.tsx` |
| `ReceiptComposer` | `app/components/receipt/ReceiptComposer.tsx` |
| `ReceiptTray` (progresso no canto) | `app/components/receipt/ReceiptTray.tsx` |
| `ReceiptReviewSheet` | `app/components/receipt/ReceiptReviewSheet.tsx` |
| `use-receipts` (fila de jobs) | `src/hooks/use-receipt-attachment.ts` + `app/components/layout/ReceiptProvider.tsx` |

A única diferença de fundo: a leitura é feita pelo backend (OCR assíncrono) em vez do
motor local do protótipo (`tesseract.js`), para não enviar 60 MB de motor de OCR para o
browser. A interacção é a mesma.

## Estrutura do formulário

```
┌──────────────────────────────────────────────┐
│ Nova transação   [Regular ▾]            [×]  │
├──────────────────────────────────────────────┤
│ MODO MANUAL                     MODO COMPROVATIVO
│ Tipo de transação                [ Gastos | Receitas ]   ← reading-top
│ [ Gastos | Receitas ]            [ Preencher manualmente | Ler comprovativo ]
│ [ Preencher manualmente | Ler comprovativo ]
│ VALOR DA TRANSAÇÃO               dropzone (desktop) / Câmara·PDF·Galeria (mobile)
│ [ 0,00 ] Kz                     lista dos ficheiros escolhidos
│ Data | Conta                     "A Wundu extrai fornecedor, valor e data…"
│ Descrição
│ Categoria                        rodapé: Cancelar | Ler N ficheiros
│ Nota adicional
│ rodapé: Cancelar | Salvar
└──────────────────────────────────────────────┘
```

- O tab (`receipt-entry-mode`) só aparece **a criar uma despesa**
  (`!editing && form.type === 'expense'`), como no protótipo. Ao passar a *Receitas*
  desaparece e o modo volta a manual.
- No modo comprovativo o formulário é substituído pelo compositor — os campos de
  valor/data/descrição/categoria **não** são mostrados.

## Fluxo (igual ao protótipo)

```
Formulário → tab "Ler comprovativo" → compositor
   │
   │  arrastar / escolher ficheiros (PDF, JPG, PNG · até 10 ficheiros de 10 MB)
   │  câmara · PDF · galeria
   ▼
"Ler N ficheiros"  → o formulário FECHA e a leitura continua em segundo plano
   │
   ▼
ReceiptTray (canto inferior direito)
   "A ler 3 comprovativos · 1 pronto"  [Rever]
   │
   ▼
ReceiptReviewSheet ("Rever transação" · "1 de 3")
   documento · valor · descrição · categoria (sugerida) · data · conta
   avisos · possível duplicado · ☑ "Conferi os dados e o valor em Kz."
   │
   ├── [ Descartar ]  → elimina o rascunho e abre o documento seguinte
   └── [ Salvar e seguinte → ]  → guarda e abre o documento seguinte
```

## Ficheiros

| Ficheiro | Papel |
|----------|-------|
| `app/components/transaction/EntryModeTabs.tsx` | Tab *Preencher manualmente / Manual* · *Ler comprovativo* |
| `app/components/transaction/TransactionTypeToggle.tsx` | Selector *Gastos / Receitas* (formulário e reading-top) |
| `app/components/receipt/ReceiptComposer.tsx` | Compositor (dropzone, câmara, PDF, galeria, lista, rodapé) |
| `app/components/receipt/ReceiptTray.tsx` | Progresso no canto, com *Rever* |
| `app/components/receipt/ReceiptReviewSheet.tsx` | Folha de revisão (*Salvar e seguinte*) |
| `app/components/layout/ReceiptProvider.tsx` | Fila de comprovativos + tray + folha de revisão (montado no `Layout`) |
| `src/hooks/use-receipt-attachment.ts` | Fila: validação, upload, polling, confirmação, extracção, limpeza |
| `app/components/transaction/TransactionForm.tsx` | Alterna entre os dois modos |
| `src/services/document.service.ts` | `upload`, `getById`, `getResult`, `confirm` |
| `src/services/transaction.service.ts` | `getById`, `update`, `delete` |

## Endpoints

```
POST /documents/upload        → { documentId, status: "PENDING" }
GET  /documents/{id}          → PENDING → OCR_PROCESSING → AWAITING_CONFIRMATION
POST /documents/{id}/confirm  → cria a transação com os dados lidos
GET  /transactions/find/{id}  → valor, descrição, categoria, data
PATCH /transactions/{id}      → guarda os valores revistos
DELETE /transactions/{id}     → descarta o rascunho
```

`AWAITING_CONFIRMATION` só expõe o resultado depois do `confirm` — e o `confirm` é o que
cria a transação. Por isso a transação criada é usada como rascunho: é actualizada no
`PATCH` quando o utilizador guarda e eliminada no `DELETE` quando descarta.

## Regras

| Regra | Comportamento |
|-------|---------------|
| Quantidade | até 10 comprovativos por leitura (como no protótipo) |
| Formatos | `application/pdf`, `image/jpeg`, `image/png` |
| Tamanho | 10 MB por ficheiro |
| Duplicados na lista | ficheiro repetido é ignorado (nome + tamanho + data) |
| E-mail por confirmar | O backend recusa o 2.º documento (`403`) — a mensagem é mostrada no compositor |
| Documento duplicado | `DUPLICATE` → "Este comprovativo já foi enviado antes." |
| Ficheiro que não é comprovativo | `REJECTED_NOT_RECEIPT` → mensagem explicativa |
| Falha de leitura | `FAILED` → "Falha na leitura" + "Ver" (tenta outra vez) |
| Confirmação | obrigatória antes de guardar ("Conferi os dados e o valor em Kz.") |
| Duplicados | avisa quando já existe uma despesa com o mesmo valor e data |
| Vários documentos | cada um é revisto à vez; "Salvar e seguinte" avança para o próximo |

## Limitações conhecidas

- A data lida no documento não traz hora: a revisão usa a hora actual.
- A **Conta** ainda não existe no `wundu-web` (como no formulário) — o campo aparece
  desactivo com a etiqueta *Brevemente*.
- Ao fechar o formulário a leitura continua (como no protótipo). Como o backend cria a
  transação ao confirmar o documento, essa transação existe antes da revisão — se o
  utilizador descartar, é eliminada.
- A caixa de mensagens dos comprovativos (`ReceiptInbox` do protótipo) não foi portada:
  a barra de progresso e a folha de revisão cobrem o fluxo.
