/** Combina a data local e hora do formulário no formato ISO esperado pela API. */
export function toTransactionDateTimeISO(dateKey: string, time: string): string {
  return new Date(`${dateKey}T${time}:00`).toISOString();
}
