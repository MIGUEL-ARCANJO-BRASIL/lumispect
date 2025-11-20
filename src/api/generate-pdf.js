// ARQUIVO: lumispect/api/generate-pdf.js

import bodyParser from "body-parser";
// CAMINHO CORRIGIDO: Sobe um nível (para lumispect/), entra em src/api/services/
import { generateReportPdf } from "../src/api/services/pdfGenerator.js";

// O Vercel espera uma função exportada
export default async function handler(req, res) {
  // 1. Aplica o body-parser
  await new Promise((resolve, reject) => {
    bodyParser.json()(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Método não permitido. Use POST." });
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

    const reportData = { result, answers, questions };

    // 2. Chama a lógica principal de PDF
    const pdfBuffer = await generateReportPdf(reportData);

    // 3. Envia o PDF como resposta de download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Lumispect_Relatorio_Detalhado.pdf"'
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("[Vercel Handler] Erro grave na geração do PDF:", error);
    res.status(500).send({
      message:
        "Erro interno ao gerar o relatório PDF. Verifique os logs do Vercel.",
    });
  }
}
