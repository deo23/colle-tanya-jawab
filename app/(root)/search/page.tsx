import { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: { name: string }[];
  views: number;
}

const Search = ({ searchQuery, tag }: { searchQuery: string, tag?: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/api/question?q=${searchQuery}`;
        if (tag) {
          url += `&tag=${tag}`;
        }
        const res = await axios.get(url);
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, tag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Search Results</h1>
      {questions.length === 0 ? (
        <div>No results found</div>
      ) : (
        questions.map((question) => (
          <div key={question._id}>
            <h2>{question.title}</h2>
            <p>{question.content}</p>
            <p>Tags: {question.tags.map((tag) => tag.name).join(', ')}</p>
            <p>Views: {question.views}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Search;
