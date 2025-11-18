import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateReportPdf } from "./services/pdfGenerator.js";

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({ origin: "http://localhost:5173" })); // Permite requisições do seu frontend Vite
app.use(bodyParser.json()); // Processa o JSON enviado no corpo da requisição

// ===============================================
// ENDPOINT PRINCIPAL: Geração de PDF (CORRIGIDO)
// ===============================================
app.post("/generate-pdf", async (req, res) => {
  try {
    // Recebe 'answers' E 'result' do frontend
    const { answers, result } = req.body;

    if (!answers || Object.keys(answers).length === 0 || !result) {
      return res.status(400).send({
        message:
          "Dados do questionário (respostas e resultado) são necessários.",
      });
    } // EXTRAI os dados do objeto 'result' que veio do frontend (corrigindo o problema do score)

    const { score, category, recommendation } = result;

    const reportData = {
      score: score,
      category: category,
      recommendation: recommendation,
      answers: answers,
    };
    console.log("Score recebido do frontend:", reportData.score);
    const pdfBuffer = await generateReportPdf(reportData);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Lumispect_Relatorio_Detalhado.pdf"',
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro na geração do PDF:", error);
    res.status(500).send({ message: "Erro interno ao gerar o relatório PDF." });
  }
});

app.listen(PORT, () => {
  console.log(`PDF API Server rodando em http://localhost:${PORT}`);
});
