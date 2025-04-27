import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Auth from './components/Auth';
import AddJournal from './components/AddJournal';
import JournalList from './components/JournalList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJournal, setEditingJournal] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchJournals = async () => {
    if (!currentUser) return;
    
    setSyncing(true);
    try {
      const journalsQuery = query(
        collection(db, 'journals'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(journalsQuery);
      const journalsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setJournals(journalsList);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchJournals();
    } else {
      setJournals([]);
      setLoading(false);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daily Journal</h1>
          {isAuthenticated && currentUser && (
            <div className="flex items-center gap-2">
              <div className="text-sm">{currentUser.email}</div>
              {syncing && <div className="text-xs bg-blue-700 py-1 px-2 rounded">Syncing...</div>}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {!isAuthenticated ? (
          <Auth setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />
        ) : (
          <>
            <AddJournal 
              currentUser={currentUser} 
              editingJournal={editingJournal} 
              setEditingJournal={setEditingJournal}
              fetchJournals={fetchJournals}
            />
            
            {loading ? (
              <div className="text-center py-12">Loading your journals...</div>
            ) : (
              <JournalList 
                currentUser={currentUser} 
                setEditingJournal={setEditingJournal}
                
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>Daily Journal App - Cloud Computing Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;