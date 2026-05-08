const fs = require('fs');
const path = require('path');

const tests = [
  { id: '001', name: 'luscher', title: 'Lüscher' },
  { id: '002', name: 'disc', title: 'DISC' },
  { id: '003', name: 'allport', title: 'Allport' },
  { id: '004', name: 'moss', title: 'Moss' },
  { id: '005', name: 'zavic', title: 'Zavic' },
  { id: '006', name: 'kostick', title: 'Kostick' },
  { id: '007', name: 'raven', title: 'Raven' },
  { id: '008', name: 'terman', title: 'Terman' },
  { id: '009', name: '16pf', title: '16PF' },
  { id: '010', name: 'mmpi', title: 'MMPI-2' }
];

const n8nDir = path.join(__dirname, 'n8n');

if (!fs.existsSync(n8nDir)) {
  fs.mkdirSync(n8nDir);
}

tests.forEach(test => {
  const workflowName = `WF-${test.id} ${test.title}`;
  const webhookPath = `wf-${test.id}-${test.name}`;
  
  const workflowJson = {
    name: workflowName,
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: webhookPath,
          responseMode: "onReceived",
          responseData: "allEntries",
          options: {}
        },
        name: "Webhook Recepción",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          resource: "text",
          operation: "generate",
          model: "gemini-1.5-pro-latest", // o el modelo preferido
          prompt: "Eres un psicólogo experto. Analiza los resultados del test {{ $json.body.slug }} y genera un reporte y un score final.\nResultados: {{ JSON.stringify($json.body.respuestas) }}"
        },
        name: "Procesamiento AI (Gemini)",
        type: "n8n-nodes-base.googleGemini",
        typeVersion: 1,
        position: [450, 300]
      },
      {
        parameters: {
          method: "POST",
          url: "https://tu-api.hackesjobs.com.mx/api/tests/update-status", // Placeholder
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: "Authorization",
                value: "Bearer TU_API_KEY"
              }
            ]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: "resultId",
                value: "={{ $json.body.resultId }}"
              },
              {
                name: "status",
                value: "completado"
              },
              {
                name: "score",
                value: "={{ $json.choices[0].message.content }}" // Placeholder
              }
            ]
          },
          options: {}
        },
        name: "Actualizar Estado en DB",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4,
        position: [650, 300]
      }
    ],
    connections: {
      "Webhook Recepción": {
        "main": [
          [
            {
              "node": "Procesamiento AI (Gemini)",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Procesamiento AI (Gemini)": {
        "main": [
          [
            {
              "node": "Actualizar Estado en DB",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    },
    settings: {
      saveExecutionProgress: true,
      saveManualExecutions: true,
      callerPolicy: "workflowsFromSameOwner"
    }
  };

  const filePath = path.join(n8nDir, `${workflowName.replace(/ /g, '_')}.json`);
  fs.writeFileSync(filePath, JSON.stringify(workflowJson, null, 2), 'utf-8');
  console.log(`Generado: ${filePath}`);
});

console.log('Todos los flujos generados con éxito.');
