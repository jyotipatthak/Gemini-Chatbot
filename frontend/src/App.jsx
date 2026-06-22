import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <ChatProvider>
      <Home />
    </ChatProvider>
  );
}

export default App;