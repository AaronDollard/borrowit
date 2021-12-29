import UserContext from './components/Contexts/AccountContext';
//import 'semantic-ui-css/semantic.min.css'
import Views from './components/Views';

function App() {
  return (
    <>
      <UserContext>
        <Views />
      </UserContext>
    </>
  );
};

export default App;
