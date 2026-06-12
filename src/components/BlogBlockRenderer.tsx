import React from 'react';
import { BlockData } from './AdminBlogManager';
import ReactMarkdown from 'react-markdown';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

export default function BlogBlockRenderer({ blocks }: { blocks: BlockData[] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="space-y-8 md:space-y-10 font-sans text-gray-800 leading-relaxed text-lg">
      {blocks.map((block) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={block.id} className="text-3xl font-bold text-gray-900 mt-12 mb-6">{block.content}</h2>;
          case 'h3':
            return <h3 key={block.id} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.content}</h3>;
          case 'paragraph':
            return (
              <div key={block.id} className="prose prose-lg max-w-none text-gray-700">
                <ReactMarkdown>{block.content || ''}</ReactMarkdown>
              </div>
            );
          case 'bullet_list':
             return (
               <ul key={block.id} className="list-disc pl-6 space-y-2 text-gray-700">
                 {block.items?.map((item, i) => <li key={i}><ReactMarkdown components={{p: ({node, ...props}) => <span {...props} />}}>{item}</ReactMarkdown></li>)}
               </ul>
             );
          case 'numbered_list':
             return (
               <ol key={block.id} className="list-decimal pl-6 space-y-2 text-gray-700">
                 {block.items?.map((item, i) => <li key={i}><ReactMarkdown components={{p: ({node, ...props}) => <span {...props} />}}>{item}</ReactMarkdown></li>)}
               </ol>
             );
          case 'note':
            return (
              <div key={block.id} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm text-blue-900 flex gap-4">
                <Info className="w-6 h-6 flex-shrink-0 text-blue-500 mt-1"/>
                <div className="prose prose-blue max-w-none"><ReactMarkdown>{block.content || ''}</ReactMarkdown></div>
              </div>
            );
          case 'warning':
            return (
              <div key={block.id} className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm text-amber-900 flex gap-4">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 text-amber-500 mt-1"/>
                <div className="prose prose-amber max-w-none"><ReactMarkdown>{block.content || ''}</ReactMarkdown></div>
              </div>
            );
          case 'advice':
            return (
              <div key={block.id} className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl shadow-sm text-green-900 flex gap-4">
                <Lightbulb className="w-6 h-6 flex-shrink-0 text-green-500 mt-1"/>
                <div className="prose prose-green max-w-none"><ReactMarkdown>{block.content || ''}</ReactMarkdown></div>
              </div>
            );
          case 'image':
            return (
              <figure key={block.id} className="my-10">
                <img src={block.image?.url} alt={block.image?.alt || ''} className="w-full h-auto rounded-2xl shadow-sm object-cover bg-gray-50 max-h-[700px] mx-auto" />
                {block.image?.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-3 italic">{block.image.caption}</figcaption>
                )}
              </figure>
            );
          case 'image_text':
          case 'text_image':
            return (
              <div key={block.id} className={`flex flex-col ${block.type === 'image_text' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 my-10 items-center`}>
                <div className="w-full md:w-1/2">
                  <img src={block.image?.url} alt={block.image?.alt || ''} className="w-full h-auto rounded-2xl shadow-sm object-cover max-h-[500px]" />
                </div>
                <div className="w-full md:w-1/2 prose prose-lg text-gray-700">
                  <ReactMarkdown>{block.content || ''}</ReactMarkdown>
                </div>
              </div>
            );
          case 'two_images':
            return (
              <div key={block.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                {block.images?.slice(0, 2).map((img, i) => (
                  <figure key={i}>
                    <img src={img.url} alt={img.alt || ''} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-sm" />
                    {img.caption && <figcaption className="text-center text-sm text-gray-500 mt-2 italic">{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            );
          case 'gallery':
            return (
              <div key={block.id} className="my-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {block.images?.map((img, i) => (
                    <img key={i} src={img.url} alt={img.alt || ''} className="w-full h-40 md:h-56 object-cover rounded-xl shadow-sm hover:opacity-95 transition" />
                  ))}
                </div>
              </div>
            );
          case 'table':
            return (
              <div key={block.id} className="overflow-x-auto my-10 border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full text-left bg-white text-sm md:text-base">
                  <tbody>
                    {block.tableData?.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx === 0 ? "bg-gray-100 text-gray-900 border-b border-gray-200" : "border-b border-gray-50 hover:bg-gray-50"}>
                        {row.map((cell, colIdx) => {
                          const CellTag = rowIdx === 0 ? 'th' : 'td';
                          return (
                            <CellTag key={colIdx} className={`p-4 ${rowIdx === 0 ? 'font-bold text-sm tracking-wider uppercase text-gray-600' : 'text-gray-700'}`}>
                              {cell}
                            </CellTag>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
