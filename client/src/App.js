import UserContext from './components/Contexts/AccountContext';

import Views from './components/Views';

function App() {
  return (
    <>
      <UserContext>
        {/* <ToggleColourMode /> */}
        <Views />
      </UserContext>
    </>
  );
};

export default App;
