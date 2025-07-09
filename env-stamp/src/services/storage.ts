import type { JournalEntry } from '../types/environment';

const STORAGE_KEY = 'env-stamp-entries';

export class StorageService {
  static saveEntry(entry: JournalEntry): void {
    try {
      const existingEntries = this.getAllEntries();
      const updatedEntries = [entry, ...existingEntries];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Failed to save entry:', error);
      throw new Error('Failed to save journal entry');
    }
  }

  static getAllEntries(): JournalEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      return [];
    }
  }

  static deleteEntry(id: string): void {
    try {
      const entries = this.getAllEntries();
      const filtered = entries.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw new Error('Failed to delete journal entry');
    }
  }

  static clearAllEntries(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear entries:', error);
      throw new Error('Failed to clear journal entries');
    }
  }

  static getStorageInfo() {
    const entries = this.getAllEntries();
    const totalSize = new Blob([JSON.stringify(entries)]).size;
    return {
      entryCount: entries.length,
      totalSize,
      isAvailable: this.isStorageAvailable(),
    };
  }

  private static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}