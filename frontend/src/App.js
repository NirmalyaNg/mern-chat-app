import './App.css';
import ChatPage from './pages/Chat';
import HomePage from './pages/Home';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Route path='/' component={HomePage} exact />
      <Route path='/chats' component={ChatPage} />
    </div>
  );
}

export default App;
