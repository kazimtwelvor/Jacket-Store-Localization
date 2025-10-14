// Server component for SEO
export default function ServerFAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="p-4 font-medium">
        <h3 className="text-lg">{question}</h3>
      </div>
      <div className="px-4 py-6 text-gray-600 border-t border-gray-100 min-h-[80px] flex items-center justify-center">
        <p className="my-2">{answer}</p>
      </div>
    </div>
  )
}
