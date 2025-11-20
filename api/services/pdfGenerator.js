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
const __dirname = path.dirname(__filename);

// PATH CORRIGIDO: Sobe 2 níveis para encontrar a pasta 'src/assets'
const ASSETS_ROOT = path.resolve(__dirname, "..", "..", "assets");

const imagePath = path.join(ASSETS_ROOT, "logo-lumis.png");
const templatePath = path.join(ASSETS_ROOT, "reportTemplate.html");

// --- Lógica para converter a imagem para Base64 (Obrigatório para o Puppeteer em Serverless) ---
let BASE64_IMAGE_URL = "";
try {
  if (!fs.existsSync(templatePath)) {
    console.error(
      `[PDF Generator] Template HTML não encontrado em: ${templatePath}`
    );
    throw new Error("Template HTML não encontrado no servidor.");
  }

  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    BASE64_IMAGE_URL = `data:image/png;base64,${imageBuffer.toString(
      "base64"
    )}`;
  } else {
    console.warn(
      `[PDF Generator] Logo não encontrada. Usando fallback para URL pública.`
    );
    BASE64_IMAGE_URL = "/logo-lumis.png";
  }
} catch (error) {
  console.error("[PDF Generator] Erro ao preparar assets:", error.message);
}
// --- Fim da Lógica Base64 ---

// -------------------------------------------------------------
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// -------------------------------------------------------------
export async function generateReportPdf(reportData) {
  // ... (Restante da sua lógica de categorização e Puppeteer permanece a mesma)
  const { score } = reportData.result;
  const numericScore =
    typeof score === "number" ? score : parseFloat(score) || 0;

  let category, description, recommendation; // ... Lógica de Categorização (continue com a sua) ...
  if (numericScore >= 70) {
    category = "Alta Probabilidade de Traços no Espectro";
    description = "...";
    recommendation = "...";
  } else if (numericScore >= 40) {
    category = "Sinais Moderados: Traços de Rigidez e Sensibilidade";
    description = "...";
    recommendation = "...";
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    description = "...";
    recommendation = "...";
  }

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
    console.error("Erro na função generateReportPdf:", e);
    throw new Error("Falha ao renderizar PDF no Chromium.");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
