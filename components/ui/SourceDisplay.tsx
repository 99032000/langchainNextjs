import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Document } from 'langchain/document';
interface SourceDisplayProps {
  doc: Document;
  index: number;
}
export default function SourceDisplay({ doc, index }: SourceDisplayProps) {
  const [canView, setCanView] = useState<boolean>(false);
  return (
    <div>
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger>
          <h3>Source {index + 1}</h3>
        </AccordionTrigger>
        <AccordionContent>
          <ReactMarkdown
            linkTarget="_blank"
            className={
              `transition-all text-ellipsis ` + (canView ? '' : 'line-clamp-3')
            }
          >
            {doc.pageContent}
          </ReactMarkdown>
          <p
            className="mt-2 cursor-pointer text-blue-500 text-base"
            onClick={() => setCanView((pre) => !pre)}
          >
            view more
          </p>
          <p className="mt-2">
            <b className=" mr-2">Source:</b>
            <a
              href={doc.metadata.source}
              target="_blank"
              className=" text-blue-600"
            >
              {doc.metadata.source}
            </a>
          </p>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
