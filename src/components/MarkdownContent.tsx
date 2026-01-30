import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { remarkCallouts } from '../lib/remark-callouts';
import 'katex/dist/katex.min.css';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
