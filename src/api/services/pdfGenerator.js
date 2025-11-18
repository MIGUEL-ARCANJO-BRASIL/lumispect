import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para o modo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Definição das perguntas completas do questionário Lumispect (para detalhamento)
const allQuestions = [
  {
    id: 1,
    text: "Quando estou lendo uma história, normalmente me concentro mais nos personagens do que nos fatos.",
  },
  {
    id: 2,
    text: "Frequentemente me pego mais concentrado em detalhes do que no quadro geral.",
  },
  {
    id: 3,
    text: "Costumo ter dificuldades em entender o que outra pessoa está pensando ou sentindo.",
  },
  {
    id: 4,
    text: "Sou muito sensível a luzes fortes, sons altos ou texturas específicas de roupas.",
  },
  {
    id: 5,
    text: "Prefiro seguir uma rotina estrita e me sinto ansioso quando ela é quebrada.",
  },
  {
    id: 6,
    text: "Gosto de organizar coleções ou itens com base em regras ou padrões específicos.",
  },
  {
    id: 7,
    text: "Tenho dificuldade em fazer contato visual durante uma conversa.",
  },
  {
    id: 8,
    text: "Me sinto mais confortável em conversas sobre meus interesses especializados do que sobre assuntos gerais.",
  },
  {
    id: 9,
    text: "Às vezes, repito frases ou palavras que ouvi de outras pessoas ou da televisão.",
  },
  {
    id: 10,
    text: "Achei mais fácil aprender a falar do que aprender a interagir socialmente com os colegas.",
  },
];

/**
 * Função principal para gerar o PDF do relatório.
 * @param {object} reportData - Objeto contendo score, category, recommendation e answers.
 * @returns {Buffer} Buffer do PDF gerado.
 */
async function generateReportPdf(reportData) {
  const { score, category, recommendation, answers } = reportData;

  // 2. Definir a classe CSS baseada na pontuação
  let scoreClass = "score-low-style";
  if (score >= 70) {
    scoreClass = "score-high-style";
  } else if (score >= 40) {
    scoreClass = "score-medium-style";
  }

  // 3. Gerar a lista de respostas detalhadas em HTML
  const responsesListHtml = allQuestions
    .map((q) => {
      const answerText = answers[q.id] || "Não respondida";
      return `
            <div class="response-item">
                <span class="response-id">Q${q.id}:</span>
                <span class="response-question">${q.text}</span>
                <span class="response-answer">${answerText}</span>
            </div>
        `;
    })
    .join("");

  // 4. Carregar e preencher o Template HTML
  // O caminho '..' sobe de 'services' para 'api', onde a pasta 'templates' DEVE estar.
  const templatePath = path.join(
    __dirname,
    "..", // Sobe para 'src/api'
    "templates", // Entra em 'src/api/templates'
    "reportTemplate.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  // Substituir variáveis no HTML
  htmlTemplate = htmlTemplate
    .replace("{{CATEGORY}}", category)
    .replace("{{RECOMMENDATION}}", recommendation)
    .replace("{{SCORE}}", score)
    .replace("{{SCORE_CLASS}}", scoreClass)
    .replace("{{RESPONSES_LIST}}", responsesListHtml)
    .replace("{{DATE}}", new Date().toLocaleDateString("pt-BR"));

  // 5. Iniciar Puppeteer para gerar o PDF
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();

  // Define o conteúdo (HTML gerado) na página
  await page.setContent(htmlTemplate, {
    waitUntil: "networkidle0",
  });

  // 6. Gerar o Buffer do PDF
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

  await browser.close();
  return pdfBuffer;
}

export { generateReportPdf };
