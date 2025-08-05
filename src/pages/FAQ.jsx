import { useState } from 'react';
import { getFaqAnswer } from '../services/faqService';

const FAQ = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const resp = await getFaqAnswer(question);
      setAnswer(resp);
    } catch {
      setAnswer('Error al obtener la respuesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl space-y-4 rounded-lg bg-white p-6 shadow">
        <h1 className="text-center text-2xl font-bold text-chapina-red">
          Preguntas Frecuentes
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Haz una pregunta..."
            className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chapina-red"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-chapina-red py-2 text-white hover:bg-chapina-red/90 disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Preguntar'}
          </button>
        </form>
        {answer && (
          <div className="rounded-lg border border-chapina-red bg-gradient-to-r from-chapina-yellow/20 to-chapina-blue/20 p-4 text-gray-800">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;

