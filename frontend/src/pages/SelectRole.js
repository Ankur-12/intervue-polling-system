export default function SelectRole({ setRole }) {
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Select Role</h1>
      <button onClick={() => setRole("teacher")}>Teacher</button>
      <button onClick={() => setRole("student")}>Student</button>
    </div>
  );
}
