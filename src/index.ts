import express from 'express';
import bodyParser from 'body-parser';
import searchRoutes from './routes/search';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', searchRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});