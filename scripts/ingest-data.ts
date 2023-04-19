import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
/* Name of directory to retrieve your files from */
const filePath = 'docs';

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();
    // console.log(rawDocs);

    // read web info
    // const loader = new PlaywrightWebBaseLoader(
    //   'https://www.fairtrading.nsw.gov.au/housing-and-property/renting/starting-a-tenancy',
    //   {
    //     launchOptions: {
    //       headless: true,
    //     },
    //     gotoOptions: {
    //       waitUntil: 'domcontentloaded',
    //     },
    //     /** Pass custom evaluate, in this case you get page and browser instances */
    //     async evaluate(page: Page, browser: Browser) {
    //       await page.waitForResponse(
    //         'https://www.fairtrading.nsw.gov.au/housing-and-property/renting/starting-a-tenancy',
    //       );

    //       const result = await page.evaluate(() => document.body.innerHTML);
    //       return result;
    //     },
    //   },
    // );
    // const loader = new CheerioWebBaseLoader(
    //   'https://www.fairtrading.nsw.gov.au/housing-and-property/renting/starting-a-tenancy',
    //   // {
    //   //   selector: 'p.athing',
    //   // },
    // );
    // const webDocs = await loader.load();
    // console.log(webDocs);
    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', JSON.stringify(docs, null, 4));

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    //! todo uncomment this
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
