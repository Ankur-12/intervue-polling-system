import { useEffect, useState } from "react";
import socket from "../socket";

export default function Student() {
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState(null);

const register = () => {
  socket.emit("join-student", name, (response) => {
    if (!response.success) {
      alert(response.message); 
      return;
    }
    setRegistered(true);
  });
};


  useEffect(() => {
    socket.on("new-question", (q) => {
      setQuestion(q);
      setResults(null);
      setAnswer("");
    });

    socket.on("show-results", (data) => {
      setResults(data);
    });
  }, []);

  const submitAnswer = () => {
    socket.emit("submit-answer", answer);
  };

  if (!registered)
    return (
      <div>
        <h2>Enter Name</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={register}>Join</button>
      </div>
    );

  return (
    <div>
      <h2>Student Panel</h2>

      {question && !results && (
        <>
          <h3>{question}</h3>
          <input
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={submitAnswer}>Submit</button>
        </>
      )}

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
