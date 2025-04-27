import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

function JournalList({ currentUser, setEditingJournal }) {
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const journalsQuery = query(
      collection(db, 'journals'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(journalsQuery, (snapshot) => {
      const journalsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJournals(journalsList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching journals:', error);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteDoc(doc(db, 'journals', id));
      } catch (error) {
        console.error('Error deleting journal:', error);
        alert('Failed to delete journal entry');
      }
    }
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
      excited: '🤩',
      tired: '😴',
      anxious: '😰'
    };
    return moods[mood] || '😐';
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Journals</h2>

      {loading ? (
        <div className="text-center py-8">Loading your journals...</div>
      ) : journals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No journals found. Start by adding a new one!</div>
      ) : (
        <div className="grid gap-6">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-700 text-lg font-semibold">{journal.title}</div>
                  <div className="text-sm text-gray-500">{formatDate(journal.createdAt)}</div>
                  <div className="mt-2 text-gray-600">{journal.content}</div>
                </div>
                <div className="text-3xl">{getMoodEmoji(journal.mood)}</div>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleEdit(journal)}
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(journal.id)}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JournalList;
