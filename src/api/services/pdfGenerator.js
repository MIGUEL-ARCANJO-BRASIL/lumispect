// ARQUIVO: lumispect/src/api/services/pdfGenerator.js

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------------------------------------------
// CONFIGURAÇÃO DE PATHS E ASSETS
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Caminho: .../src/api/services/

// ⚠️ CORREÇÃO DE PATH: Template (sobe 1 nível para /api/ e entra em /templates/)
const TEMPLATE_ROOT = path.resolve(__dirname, "..", "templates");
const templatePath = path.join(TEMPLATE_ROOT, "reportTemplate.html");

// ⚠️ CORREÇÃO DE PATH: Logo (sobe 2 níveis para /src/ e entra em /assets/)
const ASSETS_ROOT = path.resolve(__dirname, "..", "..", "assets");
const imagePath = path.join(ASSETS_ROOT, "logo-lumis.png");

// --- Lógica para converter a imagem para Base64 (Obrigatório para o Puppeteer em Serverless) ---
let BASE64_IMAGE_URL = "";
try {
  if (!fs.existsSync(templatePath)) {
    console.error(
      `[PDF Generator] Template HTML não encontrado em: ${templatePath}`
    );
    throw new Error("Template HTML não encontrado no servidor."); // Lança um erro claro
  }

  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    BASE64_IMAGE_URL = `data:image/png;base64,${imageBuffer.toString(
      "base64"
    )}`;
  } else {
    console.error(
      `[PDF Generator] Logo não encontrada no caminho: ${imagePath}`
    );
    BASE64_IMAGE_URL = "URL_DA_SUA_LOGO_ONLINE"; // Use um fallback, ou lance erro
  }
} catch (error) {
  console.error("[PDF Generator] Erro ao preparar assets:", error.message);
  // Garante que o erro de I/O (leitura de arquivo) seja propagado
  throw new Error(`Falha ao carregar assets: ${error.message}`);
}
// --- Fim da Lógica Base64 ---

// -------------------------------------------------------------
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// -------------------------------------------------------------
export async function generateReportPdf(reportData) {
  const { score } = reportData.result;
  const numericScore =
    typeof score === "number" ? score : parseFloat(score) || 0;

  // Variáveis de categorização (Preencher com sua lógica completa)
  let category, description, recommendation;
  // Exemplo de lógica de categorização:
  if (numericScore >= 70) {
    category = "Alta Probabilidade de Traços no Espectro";
    description =
      "É fortemente recomendado buscar uma avaliação profissional completa...";
    recommendation = "Recomendação 1: Acompanhamento especializado.";
  } else if (numericScore >= 40) {
    category = "Sinais Moderados: Traços de Rigidez e Sensibilidade";
    description =
      "Os resultados indicam a presença de traços de autismo. Não é um diagnóstico...";
    recommendation =
      "Recomendação 2: Auto-conhecimento e terapias específicas.";
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    description =
      "Os resultados sugerem que os traços observados são comuns na população...";
    recommendation = "Recomendação 3: Não há necessidade de ação imediata.";
  }
  // Fim do Exemplo

  const chartScoreDegrees = (numericScore / 100) * 360;
  const remainingScore = 100 - numericScore;

  let htmlTemplate = fs.readFileSync(templatePath, "utf8"); // Substituição dos Placeholders

  htmlTemplate = htmlTemplate
    .replace("{{CATEGORY}}", category)
    .replace("{{DESCRIPTION}}", description)
    .replace("{{RECOMMENDATION}}", recommendation)
    .replace(/{{SCORE}}/g, numericScore.toFixed(0))
    .replace("{{REMAINING_SCORE}}", remainingScore.toFixed(0))
    .replace("{{CHART_SCORE_DEG}}", chartScoreDegrees)
    .replace("{{DATE}}", new Date().toLocaleDateString("pt-BR"))
    .replace("{{LOGO_COMPOSITE_URL}}", BASE64_IMAGE_URL); // URL da imagem em Base64

  let browser;
  try {
    // 1. INICIA O CHROMIUM OTIMIZADO PARA VERCEL
    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-setuid-sandbox",
        // ARGUMENTOS CRÍTICOS DE OTIMIZAÇÃO DE MEMÓRIA E RECURSOS:
        "--no-sandbox",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote", // Ajudam a economizar recursos em ambientes limitados
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage(); // 2. Define o conteúdo

    await page.setContent(htmlTemplate, {
      waitUntil: "networkidle0",
    }); // 3. Gera o Buffer

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.8in", right: "0.8in", bottom: "0.8in", left: "0.8in" },
    });
    return pdfBuffer;
  } catch (e) {
    console.error("Erro na função generateReportPdf (Puppeteer/Chromium):", e); // Transforma o erro do Puppeteer em um erro simples para o Handler capturar
    throw new Error("Falha ao renderizar PDF no ambiente Serverless.");
  } finally {
    if (browser) {
      // ESSENCIAL: Fechar o browser para liberar recursos/memória
      await browser.close();
    }
  }
}
