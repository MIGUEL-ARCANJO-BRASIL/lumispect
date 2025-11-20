// EM: api/generate-pdf.js
// Ponto de entrada da API no Vercel.

import bodyParser from "body-parser";
import { generateReportPdf } from "../utils/pdfGenerator.js"; // Ajuste o caminho conforme sua estrutura

// O Vercel espera uma função exportada como handler da API Route
export default async function handler(req, res) {
  // 1. Aplica o body-parser para garantir a leitura correta do JSON do frontend
  await new Promise((resolve, reject) => {
    // body-parser para JSON
    bodyParser.json()(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // 2. Validação do Método
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Método não permitido. Use POST." });
  }

  try {
    // 3. Recebe e valida os dados do frontend
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

    // 4. Prepara os dados para o gerador de PDF
    const reportData = {
      result: result,
      answers: answers,
      questions: questions,
    };

    // 5. Gera o PDF usando a função adaptada (no arquivo separado)
    const pdfBuffer = await generateReportPdf(reportData);

    // 6. Envia o PDF como resposta de download
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
