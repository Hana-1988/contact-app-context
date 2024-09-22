import Header from './components/Header'
import AddContact from './components/AddContact'
import { ContactProvider } from './components/ContactContext';


function App() {

  return (
  <>
  <Header/>
        <ContactProvider>
            <div>
                <AddContact />
            </div>
        </ContactProvider>
  </>
  );
}

export default App
