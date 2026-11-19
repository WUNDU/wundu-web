/**
 * Livro Excel das análises — port fiel de `wundu/lib/analysis-workbook.ts`.
 * Folha `Resumo` (blocos, cores, bordas, fórmulas), `Movimentos` e
 * `Dados dos gráficos`, com os mesmos nomes, formatos e textos do protótipo.
 * Valores de entrada em cêntimos (Kz × 100).
 */

import ExcelJS from "exceljs";
import { addAnalysisCharts } from "./analysis-charts";
import { reportGrid, type AnalysisReport } from "./analysis-report";

export type WorkbookMovement = {
  date: string;
  name: string;
  category: string;
  account: string;
  type: "income" | "expense";
  /** Cêntimos, sempre positivo; o sinal é aplicado na folha. */
  amount: number;
  time?: string;
  note?: string;
};

const moneyFormat = '#,##0.00" Kz";[Red]-#,##0.00" Kz";"—"';

/** Workbook generation is loaded only when the user chooses Excel. It runs entirely in the browser. */
export function createAnalysisWorkbook(
  report: AnalysisReport,
  rows: readonly WorkbookMovement[],
) {
  const book = new ExcelJS.Workbook();
  book.creator = "Wundu";
  book.title = `Análises Wundu — ${report.title}`;
  book.calcProperties.fullCalcOnLoad = true;
  const sheet = book.addWorksheet("Resumo", {
    views: [{ showGridLines: false, zoomScale: 80 }],
    pageSetup: {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.25, right: 0.25, top: 0.35, bottom: 0.35, header: 0.1, footer: 0.1 },
    },
  });
  sheet.columns = Array.from({ length: 15 }, (_, index) => ({
    width: index % 4 === 3 ? 3 : index % 4 === 0 ? 30 : 19,
  }));
  const grid = reportGrid(report);
  grid.forEach((row) => sheet.addRow(row));
  const last = grid.length;
  sheet.eachRow((row) => {
    row.height = 23;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: "FF364152" } };
      cell.alignment = { vertical: "middle", wrapText: true };
      if (typeof cell.value === "number") cell.numFmt = moneyFormat;
    });
  });
  function merged(
    row: number,
    from: number,
    to: number,
    text?: string,
    color?: string,
  ) {
    sheet.mergeCells(row, from, row, to);
    const cell = sheet.getCell(row, from);
    if (text !== undefined) cell.value = text;
    if (color)
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + color } };
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF364152" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    return cell;
  }
  merged(1, 1, 15, report.title, "F2E7EC").font = {
    name: "Calibri",
    size: 24,
    bold: true,
    color: { argb: "FF364152" },
  };
  sheet.getRow(1).height = 40;
  merged(
    2,
    1,
    15,
    `${report.range.start} a ${report.range.end} · Wundu · Valores em kwanzas`,
  );
  sheet.getRow(2).height = 26;
  merged(4, 1, 3, "RESUMO TOTAL REALIZADO", "E8EEF1");
  report.blocks.slice(1).forEach((block, index) => {
    const row = index + 5;
    merged(row, 1, 2, block.name, block.color);
    sheet.getCell(row, 3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF" + block.color },
    };
    sheet.getCell(row, 3).value = {
      formula: `${["G", "K", "O"][index]}${last}`,
      result: block.actual / 100,
    };
  });
  merged(9, 1, 2, "Património total", "E7EDF9");
  const metrics = [
    { row: 4, label: "Entradas", formula: `C${last}`, value: report.income, color: "BEDCEB" },
    {
      row: 6,
      label: "Total realizado",
      formula: `SUM(G${last},K${last},O${last})`,
      value: report.expenses,
      color: "D4E8C6",
    },
    { row: 8, label: "Resta", formula: "G4-G6", value: report.remaining, color: "FFF0AD" },
  ];
  metrics.forEach((metric) => {
    merged(metric.row, 5, 6, metric.label, metric.color);
    const cell = sheet.getCell(metric.row, 7);
    cell.value = { formula: metric.formula, result: metric.value / 100 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF" + metric.color },
    };
    cell.font = { name: "Calibri", size: 12, bold: true };
    cell.numFmt = moneyFormat;
    sheet.getRow(metric.row).height = 27;
  });
  merged(4, 9, 10, "% Realizado");
  sheet.getCell("K4").value =
    report.ratio === null
      ? "Sem entradas"
      : { formula: "IF(G4>0,G6/G4,0)", result: report.ratio };
  sheet.getCell("K4").numFmt = "0%";
  merged(
    11,
    1,
    15,
    "Orçamentos mensais por categoria. Entradas previstas não são registadas na aplicação.",
  );
  merged(
    12,
    1,
    15,
    `${report.months} ${report.months === 1 ? "mês incluído" : "meses incluídos"}. Meses parciais usam o orçamento completo. Células sem orçamento ficam em branco.`,
  );
  [11, 12].forEach((row) => {
    sheet.getRow(row).height = 25;
    sheet.getCell(row, 1).alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };
    sheet.getCell(row, 1).font = {
      name: "Calibri",
      size: 10,
      color: { argb: "FF62748E" },
    };
  });
  report.blocks.forEach((block, index) => {
    const start = index * 4 + 1;
    const planned = sheet.getColumn(start + 1).letter;
    const actual = sheet.getColumn(start + 2).letter;
    merged(14, start, start + 2, block.name, block.color);
    sheet.getRow(14).height = 29;
    for (let row = 15; row <= 17; row++)
      merged(row, start, start + 1, grid[row - 1][start - 1] as string, block.color);
    for (let row = 14; row <= last; row++) {
      if (row === 18) continue;
      for (let column = start; column <= start + 2; column++) {
        const cell = sheet.getCell(row, column);
        cell.border = {
          top: { style: "hair", color: { argb: "FF" + block.border } },
          bottom: { style: "hair", color: { argb: "FF" + block.border } },
          left: { style: "hair", color: { argb: "FF" + block.border } },
          right: { style: "hair", color: { argb: "FF" + block.border } },
        };
        if (row <= 17 || row === 19 || row === last)
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF" + block.color },
          };
        if (column > start) cell.numFmt = moneyFormat;
        if (row === 19 || row === last)
          cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF364152" } };
      }
    }
    sheet.getCell(last, start + 1).value =
      block.planned === null
        ? null
        : {
            formula: `SUM(${planned}20:${planned}${last - 1})`,
            result: block.planned / 100,
          };
    sheet.getCell(last, start + 2).value = {
      formula: `SUM(${actual}20:${actual}${last - 1})`,
      result: block.actual / 100,
    };
    sheet.getCell(15, start + 2).value =
      block.planned === null
        ? null
        : { formula: `${planned}${last}`, result: block.planned / 100 };
    sheet.getCell(16, start + 2).value = {
      formula: `${actual}${last}`,
      result: block.actual / 100,
    };
    sheet.getCell(17, start + 2).value =
      block.difference === null
        ? null
        : {
            formula: `${actual}16-${actual}15`,
            result: block.difference / 100,
          };
  });
  sheet.getRow(17).height = 32;
  sheet.getRow(19).height = 29;
  sheet.getRow(last).height = 28;
  merged(
    last + 2,
    1,
    15,
    "Grupos: despesas essenciais incluem alimentação, casa, saúde, educação e transportes; investimentos usam as categorias Investimento/Investimentos/Aplicações. Restantes gastos ficam em pessoais e outros.",
  );
  sheet.getRow(last + 2).height = 32;
  sheet.getCell(last + 2, 1).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "left",
  };
  merged(
    last + 3,
    1,
    15,
    "Diferenças ficam em branco quando faltam orçamentos. Gráficos ligados às células: actualizam-se ao editar os valores realizados.",
  );
  sheet.pageSetup.printArea = `A1:O${last + 3}`;

  const movements = book.addWorksheet("Movimentos", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FFBEDCEB" } },
  });
  movements.columns = [
    { header: "Data", key: "date", width: 15 },
    { header: "Descrição", key: "name", width: 44 },
    { header: "Categoria", key: "category", width: 25 },
    { header: "Conta", key: "account", width: 28 },
    { header: "Tipo", key: "type", width: 15 },
    { header: "Valor (Kz)", key: "amount", width: 23 },
    { header: "Hora", key: "time", width: 12 },
    { header: "Nota adicional", key: "note", width: 50 },
  ];
  for (const transaction of rows) {
    movements.addRow({
      date: new Date(transaction.date + "T12:00:00Z"),
      name: transaction.name,
      category: transaction.category,
      account: transaction.account,
      type: transaction.type === "income" ? "Entrada" : "Gasto",
      amount: ((transaction.type === "income" ? 1 : -1) * transaction.amount) / 100,
      time: transaction.time ?? "",
      note: transaction.note ?? "",
    });
  }
  movements.getColumn("date").numFmt = "dd/mm/yyyy";
  movements.getColumn("amount").numFmt = moneyFormat;
  movements.autoFilter = "A1:H1";
  movements.getRow(1).font = { name: "Calibri", bold: true, size: 12 };
  movements.getRow(1).height = 28;
  movements.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBEDCEB" } };
  });
  const chartData = book.addWorksheet("Dados dos gráficos", {
    views: [{ showGridLines: false }],
  });
  chartData.columns = [{ width: 22 }, { width: 22 }, { width: 4 }, { width: 46 }];
  chartData.addRow(["Parcela", "Percentagem", null, "Título do gráfico"]);
  chartData.addRow([
    "Realizado",
    {
      formula: "IF('Resumo'!G4>0,MIN(1,MAX(0,'Resumo'!G6/'Resumo'!G4)),0)",
      result: Math.min(1, Math.max(0, report.ratio ?? 0)),
    },
    null,
    {
      formula:
        "IF('Resumo'!G4>0,TEXT('Resumo'!G6/'Resumo'!G4,\"0%\")&\" Realizado\",\"Sem entradas\")",
      result:
        report.ratio === null
          ? "Sem entradas"
          : Math.round(report.ratio * 100) + "% Realizado",
    },
  ]);
  chartData.addRow([
    "Disponível",
    {
      formula: "1-B2",
      result: 1 - Math.min(1, Math.max(0, report.ratio ?? 0)),
    },
  ]);
  chartData.getColumn(2).numFmt = "0%";
  chartData.getRow(1).font = { bold: true, name: "Calibri", size: 11 };
  chartData.getCell("A5").value =
    "O anel mostra a parcela utilizada das entradas, até 100%. O título mantém a percentagem real, mesmo quando os gastos ultrapassam as entradas.";
  chartData.mergeCells("A5:D6");
  chartData.getCell("A5").alignment = { wrapText: true, vertical: "middle" };
  return book;
}

/** Export includes editable DrawingML charts with live formula references. */
export async function createAnalysisXlsx(
  report: AnalysisReport,
  rows: readonly WorkbookMovement[],
): Promise<Uint8Array> {
  const book = createAnalysisWorkbook(report, rows);
  return addAnalysisCharts(new Uint8Array(await book.xlsx.writeBuffer()), report);
}
