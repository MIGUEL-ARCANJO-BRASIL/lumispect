// EM: api/generate-pdf.js

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

// -------------------------------------------------------------
// CONFIGURAÇÃO DE PATHS NO AMBIENTE VERCEL (CORRIGIDO)
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a raiz do projeto (um nível acima da pasta 'api')
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ASSETS_ROOT = path.join(PROJECT_ROOT, "assets");

const imagePath = path.join(ASSETS_ROOT, "logo-lumis.png");
const templatePath = path.join(ASSETS_ROOT, "reportTemplate.html");

// --- Lógica para converter a imagem para Base64 ---
let BASE64_IMAGE_URL = "";
try {
  // Verifica se o template está no caminho esperado
  if (!fs.existsSync(templatePath)) {
    console.error(`[Vercel] Template HTML não encontrado em: ${templatePath}`); // Lança um erro para que a função falhe se não puder ler o template
    throw new Error(
      "Template HTML (reportTemplate.html) não encontrado no servidor."
    );
  }

  if (!fs.existsSync(imagePath)) {
    console.warn(
      `[Vercel] Logo não encontrada em: ${imagePath}. Usando fallback para URL pública.`
    ); // Fallback: se não puder ler o arquivo local, usa a URL pública (requer que a logo esteja na pasta 'public')
    BASE64_IMAGE_URL = "/logo-lumis.png";
  } else {
    // Converte a imagem para Base64 se o arquivo for encontrado (mais seguro para Puppeteer)
    const imageBuffer = fs.readFileSync(imagePath);
    BASE64_IMAGE_URL = `data:image/png;base64,${imageBuffer.toString(
      "base64"
    )}`;
  }
} catch (error) {
  console.error("[Vercel] Erro ao preparar arquivos estáticos:", error.message); // Não lança erro fatal aqui, apenas registra, pois a falha será capturada abaixo.
}
// --- Fim da Lógica Base64 ---

// -------------------------------------------------------------
// FUNÇÃO DE GERAÇÃO DE PDF (ADAPTADA PARA CHROMIUM-MIN)
// -------------------------------------------------------------
async function generateReportPdf(reportData) {
  const { score } = reportData.result;
  const numericScore =
    typeof score === "number" ? score : parseFloat(score) || 0;

  let category = "";
  let description = "";
  let recommendation = ""; // Lógica de categorização (Mantida a do seu código original)
  if (numericScore >= 70) {
    category = "Alta Probabilidade de Traços no Espectro";
    description =
      "O resultado do seu teste indica uma forte presença de traços avaliados pelo Lumispect. É crucial entender que esta é apenas uma triagem, mas o alinhamento com o escore máximo sugere que buscar uma avaliação profissional formal pode ser o passo mais importante para o seu autoconhecimento e bem-estar.";
    recommendation =
      "Recomendamos fortemente a busca por profissionais de saúde mental (Neurologista, Psiquiatra ou Psicólogo com experiência em TEA) para um diagnóstico formal e início de um plano de suporte. Temos uma lista de clínicas e especialistas parceiros que podem auxiliar neste processo.";
  } else if (numericScore >= 40) {
    category = "Sinais Moderados: Traços de Rigidez e Sensibilidade";
    description =
      "Seu resultado indica uma presença moderada de traços relacionados ao espectro. Embora o Lumispect não seja diagnóstico, esses traços podem impactar áreas da sua vida. O autoconhecimento é a chave.";
    recommendation =
      "Se os traços causarem desconforto significativo, uma consulta com um profissional de saúde mental é o caminho. Procure informações confiáveis e continue a se observar. Considere conversar com um psicólogo para explorar esses traços em profundidade.";
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    description =
      "O seu resultado sugere que as suas experiências se alinham mais com o padrão neurotípico, com pouca intensidade nos traços avaliados. Continue focando no seu bem-estar geral e no autoconhecimento.";
    recommendation =
      "Se os traços causarem desconforto significativo, uma consulta com um profissional de saúde mental é o caminho. Procure informações confiáveis e continue a se observar. Considere conversar com um psicólogo para explorar esses traços em profundidade.";
  }

  const chartScoreDegrees = (numericScore / 100) * 360;
  const remainingScore = 100 - numericScore; // Leitura do template (a verificação de existência já foi feita acima)

  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  htmlTemplate = htmlTemplate
    .replace("{{CATEGORY}}", category)
    .replace("{{DESCRIPTION}}", description)
    .replace("{{RECOMMENDATION}}", recommendation)
    .replace(/{{SCORE}}/g, numericScore.toFixed(0))
    .replace("{{REMAINING_SCORE}}", remainingScore.toFixed(0))
    .replace("{{CHART_SCORE_DEG}}", chartScoreDegrees)
    .replace("{{DATE}}", new Date().toLocaleDateString("pt-BR"))
    .replace("{{LOGO_COMPOSITE_URL}}", BASE64_IMAGE_URL);

  let browser;
  try {
    // 1. INICIA O CHROMIUM OTIMIZADO PARA VERCEL
    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: [...chromium.args, "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage(); // 2. Define o conteúdo e espera o carregamento

    await page.setContent(htmlTemplate, {
      waitUntil: "networkidle0",
    }); // 3. Gera o Buffer

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.8in",
        right: "0.8in",
        bottom: "0.8in",
        left: "0.8in",
      },
    });
    return pdfBuffer;
  } catch (e) {
    console.error("Erro na função generateReportPdf:", e);
    throw new Error("Falha ao renderizar PDF no Chromium.");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// -------------------------------------------------------------
// HANDLER PRINCIPAL (PONTO DE ENTRADA DO VERCEL)
// -------------------------------------------------------------
export default async function handler(req, res) {
  // Middleware de body-parser para garantir que o corpo seja JSON
  await new Promise((resolve, reject) => {
    bodyParser.json()(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Método não permitido." });
  }

  try {
    const { answers, result, questions } = req.body;

    if (
      !answers ||
      Object.keys(answers).length === 0 ||
      !result ||
      !questions
    ) {
      return res.status(400).send({
        message:
          "Dados do questionário (respostas, perguntas e resultado) são necessários.",
      });
    }

    const reportData = {
      result: result,
      answers: answers,
      questions: questions,
    };

    const pdfBuffer = await generateReportPdf(reportData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Lumispect_Relatorio_Detalhado.pdf"'
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("[Vercel Handler] Erro na geração do PDF:", error);
    res.status(500).send({
      message:
        "Erro interno ao gerar o relatório PDF. Verifique os logs do Vercel.",
    });
  }
}
