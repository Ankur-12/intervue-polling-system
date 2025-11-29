import { useEffect, useState } from "react";
import socket from "../socket";

export default function Teacher() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.on("show-results", (data) => setResults(data));
  }, []);

  const askQuestion = () => {
    socket.emit("ask-question", question);
    setResults(null);
  };

  return (
    <div>
      <h2>Teacher Panel</h2>

      <input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askQuestion}>Ask Question</button>

      {results && (
        <div>
          <h3>Results</h3>
         {Object.entries(results).map(([id, data]) => (
  <p key={id}>{data.name}: {data.answer}</p>
))}

        </div>
      )}
    </div>
  );
}
