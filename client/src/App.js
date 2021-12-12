import UserContext from './components/Contexts/AccountContext';
import ToggleColourMode from './components/ToggleColourMode';

import Views from './components/Views';

function App() {
  return (
    <>
      <UserContext>
        <ToggleColourMode />
        <Views />
      </UserContext>
    </>
  );
};

export default App;
