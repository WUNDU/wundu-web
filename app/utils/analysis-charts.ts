import JSZip from 'jszip';
import type {AnalysisReport} from './analysis-report';

const chartNS='http://schemas.openxmlformats.org/drawingml/2006/chart';
const drawingNS='http://schemas.openxmlformats.org/drawingml/2006/main';
const relNS='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const packageNS='http://schemas.openxmlformats.org/package/2006/relationships';
const xmlHeader='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const xml=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const fill=(color:string)=>`<c:spPr><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:ln><a:noFill/></a:ln></c:spPr>`;
const points=(values:(string|number)[])=>`<c:ptCount val="${values.length}"/>${values.map((value,index)=>`<c:pt idx="${index}"><c:v>${xml(String(value))}</c:v></c:pt>`).join('')}`;
const categories=(formula:string,values:string[])=>`<c:cat><c:strRef><c:f>${xml(formula)}</c:f><c:strCache>${points(values)}</c:strCache></c:strRef></c:cat>`;
const values=(formula:string,items:number[],format='General')=>`<c:val><c:numRef><c:f>${xml(formula)}</c:f><c:numCache><c:formatCode>${xml(format)}</c:formatCode>${points(items)}</c:numCache></c:numRef></c:val>`;
const rich=(text:string)=>`<c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1100"/></a:pPr><a:r><a:t>${xml(text)}</a:t></a:r></a:p></c:rich>`;
const textStyle='<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1000"><a:solidFill><a:srgbClr val="62748E"/></a:solidFill></a:defRPr></a:pPr><a:endParaRPr lang="pt-PT"/></a:p></c:txPr>';
function chart(title:string,plot:string,legend=false,linkedTitle?:{formula:string;value:string}){
  const titleText=linkedTitle?`<c:strRef><c:f>${xml(linkedTitle.formula)}</c:f><c:strCache>${points([linkedTitle.value])}</c:strCache></c:strRef>`:rich(title);
  return `${xmlHeader}<c:chartSpace xmlns:c="${chartNS}" xmlns:a="${drawingNS}" xmlns:r="${relNS}"><c:lang val="pt-PT"/><c:chart><c:title><c:tx>${titleText}</c:tx><c:overlay val="0"/>${textStyle}</c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/>${plot}</c:plotArea>${legend?`<c:legend><c:legendPos val="b"/><c:overlay val="0"/>${textStyle}</c:legend>`:''}<c:plotVisOnly val="0"/><c:dispBlanksAs val="zero"/></c:chart>${fill('FFFFFF')}${textStyle}</c:chartSpace>`;
}

/** ExcelJS writes cells; these standard DrawingML parts add actual editable charts.
 * Series use worksheet references and caches only supply the initial preview.
 * https://learn.microsoft.com/office/open-xml/spreadsheet/how-to-insert-a-chart-into-a-spreadsheet
 */
export async function addAnalysisCharts(bytes:Uint8Array,report:AnalysisReport):Promise<Uint8Array>{
  const zip=await JSZip.loadAsync(bytes);
  const fraction=Math.min(1,Math.max(0,report.ratio??0));
  const seriesStart='<c:idx val="0"/><c:order val="0"/>';
  const doughnut=`<c:doughnutChart><c:varyColors val="1"/><c:ser>${seriesStart}<c:tx><c:v>Gastos / entradas</c:v></c:tx>${['A9CE8D','FFF0AD'].map((color,index)=>`<c:dPt><c:idx val="${index}"/>${fill(color)}</c:dPt>`).join('')}${categories("'Dados dos gráficos'!$A$2:$A$3",['Realizado','Disponível'])}${values("'Dados dos gráficos'!$B$2:$B$3",[fraction,1-fraction],'0%')}</c:ser><c:firstSliceAng val="270"/><c:holeSize val="65"/></c:doughnutChart>`;
  const blocks=report.blocks.slice(1);
  const bars=`<c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="1"/><c:ser>${seriesStart}<c:tx><c:v>Total realizado</c:v></c:tx>${blocks.map((block,index)=>`<c:dPt><c:idx val="${index}"/>${fill(block.color)}</c:dPt>`).join('')}${categories("'Resumo'!$A$5:$A$7",blocks.map(b=>b.name))}${values("'Resumo'!$C$5:$C$7",blocks.map(b=>b.actual/100),'#,##0.00" Kz"')}</c:ser><c:dLbls><c:numFmt formatCode="#,##0.00&quot; Kz&quot;" sourceLinked="0"/><c:dLblPos val="outEnd"/><c:showLegendKey val="0"/><c:showVal val="1"/><c:showCatName val="0"/><c:showSerName val="0"/></c:dLbls><c:gapWidth val="70"/><c:axId val="10001"/><c:axId val="10002"/></c:barChart><c:catAx><c:axId val="10001"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:axPos val="b"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/>${textStyle}<c:crossAx val="10002"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/></c:catAx><c:valAx><c:axId val="10002"/><c:scaling><c:orientation val="minMax"/><c:min val="0"/></c:scaling><c:delete val="1"/><c:axPos val="l"/><c:numFmt formatCode="#,##0&quot; Kz&quot;" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="none"/><c:crossAx val="10001"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx>`;
  zip.file('xl/charts/chart1.xml',chart('% Realizado',doughnut,true,{formula:"'Dados dos gráficos'!$D$2",value:report.ratio===null?'Sem entradas':`${Math.round(report.ratio*100)}% Realizado`}));
  zip.file('xl/charts/chart2.xml',chart('Total realizado',bars));
  const anchor=(id:number,from:number,to:number)=>`<xdr:twoCellAnchor><xdr:from><xdr:col>${from}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>4</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${to}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>10</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${id+1}" name="${id===1?'Percentagem realizada':'Total realizado'}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="${chartNS}"><c:chart xmlns:c="${chartNS}" xmlns:r="${relNS}" r:id="rId${id}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`;
  zip.file('xl/drawings/drawing1.xml',`${xmlHeader}<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="${drawingNS}">${anchor(1,8,11)}${anchor(2,12,15)}</xdr:wsDr>`);
  zip.file('xl/drawings/_rels/drawing1.xml.rels',`${xmlHeader}<Relationships xmlns="${packageNS}">${[1,2].map(id=>`<Relationship Id="rId${id}" Type="${relNS}/chart" Target="../charts/chart${id}.xml"/>`).join('')}</Relationships>`);
  const sheetPath='xl/worksheets/sheet1.xml',sheet=await zip.file(sheetPath)!.async('string');
  if(sheet.includes('<drawing '))throw new Error('O resumo já contém um desenho.');
  zip.file(sheetPath,sheet.replace('</worksheet>','<drawing r:id="rIdWunduCharts"/></worksheet>'));
  const relPath='xl/worksheets/_rels/sheet1.xml.rels';
  const relationships=await zip.file(relPath)?.async('string')??`${xmlHeader}<Relationships xmlns="${packageNS}"></Relationships>`;
  zip.file(relPath,relationships.replace('</Relationships>',`<Relationship Id="rIdWunduCharts" Type="${relNS}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`));
  const types=await zip.file('[Content_Types].xml')!.async('string');
  zip.file('[Content_Types].xml',types.replace('</Types>',`<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>${[1,2].map(id=>`<Override PartName="/xl/charts/chart${id}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`).join('')}</Types>`));
  const workbook=await zip.file('xl/workbook.xml')!.async('string');
  zip.file('xl/workbook.xml',workbook.replace(/<calcPr[^>]*\/>/,'<calcPr calcId="191029" calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1"/>'));
  return zip.generateAsync({type:'uint8array',compression:'DEFLATE'});
}
