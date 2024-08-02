    import express from 'express';
    import client from '../elasticsearchClient';

    const router = express.Router();

    router.get('/search', async (req, res) => {
        const  q  = req.query.query as string;

        if (!q) {
            res.status(400).json({ error: 'Missing query parameter' });
            return;
        }

        try{
            const response = await client.search({
                index: 'tools',
                body: {
                    query: {
                        multi_match: {
                            query: q,
                            fields: ['name', 'category', 'description']
                        }
                    },
                    highlight: {
                        fields: {
                            name: {},
                            category: {},
                            description: {}
                        }
                    }
                }
            });
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to search tools' });
        }
    });

    export default router;