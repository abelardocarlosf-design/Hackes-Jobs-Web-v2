const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZTJiOWZjNi01NzMzLTQ2NTQtYjUxMS1lZmM0OGViMzhiNDEiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6Ijg1NTI1ODBhLWExZDMtNGRkZC04NGY4LWJkNjZkMWNlNzBlNyIsImlhdCI6MTc3NzMzMzQ4OX0.AGcWm8v8SRf-0Ir1kviGs4ouw3EhfOBnbSe8N7VJVXU';
const url = 'http://localhost:5678/api/v1/workflows';

const workflowsDir = path.join(__dirname, 'n8n-workflows');
const files = fs.readdirSync(workflowsDir);

async function uploadWorkflows() {
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(workflowsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': token
          },
          body: content
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Uploaded ${file} successfully. ID: ${data.id}`);
        } else {
          const errorData = await response.text();
          console.error(`❌ Failed to upload ${file}: ${response.status} ${response.statusText}`);
          console.error(`Details: ${errorData}`);
        }
      } catch (err) {
        console.error(`❌ Connection error when uploading ${file}: ${err.message}`);
      }
    }
  }
}

uploadWorkflows();
