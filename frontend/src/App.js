import { useState } from "react";
import SelectRole from "./pages/SelectRole";
import Teacher from "./components/Teacher";
import Student from "./components/Student";

function App() {
  const [role, setRole] = useState(null);

  if (!role) return <SelectRole setRole={setRole} />;

  return role === "teacher" ? <Teacher /> : <Student />;
}

export default App;
