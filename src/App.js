import './App.css';
//import Holidays from './components/common/Holidays'
import SignIn from './components/common/SignIn';
import Holidays from './components/common/Holidays'
import '../src/styles/css/main.css'
function App() {
  return (
    <div className="App">
     
      <SignIn />
      <Holidays />
    </div>
  );
}

export default App;
