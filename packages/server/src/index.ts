import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const clientBuildPath = path.join(__dirname, '../../client/build');

app.use(express.static(clientBuildPath));

// Middleware
app.use(express.json());

// Routes
app.get('/api', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.post('/api/echo', (req: Request, res: Response) => {
  res.json({ youSent: req.body });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
