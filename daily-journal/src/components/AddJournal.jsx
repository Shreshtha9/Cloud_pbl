import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

function AddJournal({ currentUser, editingJournal, setEditingJournal, fetchJournals }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingJournal) {
      setTitle(editingJournal.title || '');
      setContent(editingJournal.content || '');
      setMood(editingJournal.mood || 'neutral');
    } else {
      resetForm();
    }
  }, [editingJournal]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('neutral');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const journalsRef = collection(db, 'journals');

      if (editingJournal) {
        // Update existing journal
        const journalRef = doc(journalsRef, editingJournal.id);
        await updateDoc(journalRef, {
          title: title.trim(),
          content: content.trim(),
          mood,
          updatedAt: serverTimestamp(),
        });
        setEditingJournal(null);
      } else {
        // Add new journal
        await addDoc(journalsRef, {
          userId: currentUser?.uid || '',
          userEmail: currentUser?.email || '',
          title: title.trim(),
          content: content.trim(),
          mood,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      resetForm();
      fetchJournals(); // Reload journal list
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingJournal(null);
    resetForm();
  };

  const moodOptions = [
    { value: 'happy', label: 'Happy 😊' },
    { value: 'sad', label: 'Sad 😢' },
    { value: 'angry', label: 'Angry 😠' },
    { value: 'neutral', label: 'Neutral 😐' },
    { value: 'excited', label: 'Excited 🤩' },
    { value: 'tired', label: 'Tired 😴' },
    { value: 'anxious', label: 'Anxious 😰' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {editingJournal ? 'Edit Journal Entry' : 'Create New Journal Entry'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Today's thoughts..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {moodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Journal Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="8"
            placeholder="Write your thoughts here..."
            required
          ></textarea>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : editingJournal ? 'Update Entry' : 'Save Entry'}
          </button>

          {editingJournal && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddJournal;
