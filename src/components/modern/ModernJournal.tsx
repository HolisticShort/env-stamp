import { useState, useEffect } from 'react';
import type { JournalEntry } from '../../types/environment';
import { StorageService } from '../../services/storage';
import { getCurrentEnvironment } from '../../config/environment';
import { FeatureCard } from './FeatureCard';

const MAX_ENTRY_LENGTH = 2000;

export function ModernJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const environment = getCurrentEnvironment();

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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getEnvironmentColor = (env: string) => {
    const colors = {
      local: 'from-blue-500 to-blue-600',
      dev: 'from-green-500 to-green-600',
      test: 'from-yellow-500 to-yellow-600',
      prod: 'from-red-500 to-red-600',
    };
    return colors[env as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const filteredEntries = entries.filter(entry =>
    searchQuery === '' || 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.environment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: entries.length,
    thisEnvironment: entries.filter(e => e.environment === environment).length,
    lastWeek: entries.filter(e => {
      const entryDate = new Date(e.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    }).length
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="heading-xl gradient-text mb-4">Development Journal</h1>
          <p className="text-white/80 text-xl mb-6">
            Document your development journey across environments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <FeatureCard
            title="Total Entries"
            description="All journal entries across environments"
            icon="📝"
            status="active"
            value={stats.total}
            gradient="from-blue-500 to-blue-600"
          />
          <FeatureCard
            title="This Environment"
            description={`Entries written in ${environment.toUpperCase()}`}
            icon="🌍"
            status="active"
            value={stats.thisEnvironment}
            gradient={getEnvironmentColor(environment)}
          />
          <FeatureCard
            title="Recent Activity"
            description="Entries from the last 7 days"
            icon="⏰"
            status="active"
            value={stats.lastWeek}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Entry Form */}
          <div className="lg:col-span-1">
            <div className="modern-card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="heading-md text-white mb-6">New Entry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="entry-content" className="block text-white font-medium mb-3">
                    What's on your mind?
                  </label>
                  <textarea
                    id="entry-content"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="Share your development insights, challenges, or discoveries..."
                    className="modern-input h-32 resize-none"
                    maxLength={MAX_ENTRY_LENGTH}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/60 text-sm">
                      {newEntry.length}/{MAX_ENTRY_LENGTH} characters
                    </span>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Environment:</span>
                      <span className={`px-2 py-1 rounded-md bg-gradient-to-r ${getEnvironmentColor(environment)} text-white font-medium`}>
                        {environment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !newEntry.trim()}
                  className="modern-btn-primary w-full justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Save Entry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2">
            <div className="modern-card animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-md text-white">Journal Entries ({filteredEntries.length})</h2>
                
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search entries..."
                    className="modern-input pl-10 w-64"
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📔</div>
                    <h3 className="text-white font-medium mb-2">
                      {searchQuery ? 'No matching entries' : 'No journal entries yet'}
                    </h3>
                    <p className="text-white/70">
                      {searchQuery 
                        ? `No entries found for "${searchQuery}"`
                        : 'Start documenting your development journey!'
                      }
                    </p>
                  </div>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getEnvironmentColor(entry.environment)} text-white text-xs font-medium`}>
                            {entry.environment.toUpperCase()}
                          </div>
                          <span className="text-white/60 text-sm">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                          aria-label="Delete entry"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <p className="text-white leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}