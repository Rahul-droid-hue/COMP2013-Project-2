import "./App.css";
import ThriftHappens from "./Components/ThriftHappens";
import { products } from "./data/data";

function App() {
  return (
    <>
      <ThriftHappens data={products} />
    </>
  );
}

export default App;
