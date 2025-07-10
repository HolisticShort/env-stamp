import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types/environment';
import { StorageService } from '../services/storage';
import { getCurrentEnvironment } from '../config/environment';

const MAX_ENTRY_LENGTH = 2000;

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    try {
      const loadedEntries = StorageService.getAllEntries();
      setEntries(loadedEntries);
    } catch {
      setError('Failed to load journal entries');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.trim()) {
      setError('Please enter some content');
      return;
    }

    if (newEntry.length > MAX_ENTRY_LENGTH) {
      setError(`Entry too long. Maximum ${MAX_ENTRY_LENGTH} characters allowed.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        content: newEntry.trim(),
        timestamp: new Date().toISOString(),
        environment: getCurrentEnvironment(),
      };

      StorageService.saveEntry(entry);
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
    } catch {
      setError('Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    try {
      StorageService.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch {
      setError('Failed to delete entry');
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEnvironmentBadgeColor = (env: string) => {
    const colors = {
      local: 'bg-blue-100 text-blue-800',
      dev: 'bg-green-100 text-green-800',
      test: 'bg-yellow-100 text-yellow-800',
      prod: 'bg-red-100 text-red-800',
    };
    return colors[env as keyof typeof colors] || 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6">New Journal Entry</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-blue-50 focus:bg-white transition-colors"
              rows={4}
              maxLength={MAX_ENTRY_LENGTH}
              aria-label="Journal entry content"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-blue-600">
                {newEntry.length}/{MAX_ENTRY_LENGTH} characters
              </span>
              <span className="text-xs text-blue-500">
                Environment: {getCurrentEnvironment().toUpperCase()}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !newEntry.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-900">
          Previous Entries ({entries.length})
        </h3>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-blue-600">
            <p>No journal entries yet. Write your first entry above!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEnvironmentBadgeColor(entry.environment)}`}>
                    {entry.environment.toUpperCase()}
                  </span>
                  <span className="text-sm text-blue-600">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                  aria-label="Delete entry"
                >
                  Delete
                </button>
              </div>
              <p className="text-blue-900 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}