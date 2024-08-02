import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse';
import axios from 'axios';
import { Tool } from '../models/tool';

const ELASTICSEARCH_URL = 'http://localhost:9200';
const CSV_FILE = path.join(__dirname, '..', 'data', 'all_tools.csv');

const tools: Tool[] = [];
// Read the CSV file
fs.createReadStream(CSV_FILE)
    .pipe(parse({delimiter: ','}))
    .on('data', (row : string[]) => {
        const tool = {
            name: row[0],
            link: row[1],
            category: row[2],
            description: row[3],
        };
        tools.push(tool);
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        await ingestData(tools);
    });

/**
 * Ingests the given array of tools into Elasticsearch.
 *
 * @param {Tool[]} tools - The array of tools to be ingested.
 * @return {Promise<void>} - A promise that resolves when the ingestion is complete.
 */
const ingestData = async (tools: Tool[]) => {
    for (const tool of tools) {
        try{
            const response = await axios.post(`${ELASTICSEARCH_URL}/tools/_doc`, tool);
            console.log('Ingested tool:${tool.name}');
        } catch (error) {
            console.error(`Failed to ingest tool: ${tool.name}`);  
        }

    }
    console.log('Ingestion complete');
};



