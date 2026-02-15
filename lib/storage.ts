// lib/storage.ts
// localStorage helpers for saving user code and progress

const STORAGE_KEYS = {
  USER_CODE: 'sql_navigator_user_code',
  PROGRESS: 'sql_navigator_progress',
  SETTINGS: 'sql_navigator_settings',
} as const;

// ============================================
// USER CODE STORAGE
// ============================================

interface UserCodeStorage {
  [questionId: string]: string;
}

// Save user's SQL code for a specific question
export function saveUserCode(questionId: string | number, code: string): void {
  try {
    const existing = getUserCodeStorage();
    existing[String(questionId)] = code;
    localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save user code:', error);
  }
}

// Get user's SQL code for a specific question
export function getUserCode(questionId: string | number): string | null {
  try {
    const storage = getUserCodeStorage();
    return storage[String(questionId)] || null;
  } catch (error) {
    console.error('Failed to get user code:', error);
    return null;
  }
}

// Get all saved user code
function getUserCodeStorage(): UserCodeStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_CODE);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Clear user code for a specific question
export function clearUserCode(questionId: string | number): void {
  try {
    const existing = getUserCodeStorage();
    delete existing[String(questionId)];
    localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to clear user code:', error);
  }
}

// Clear all user code
export function clearAllUserCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_CODE);
  } catch (error) {
    console.error('Failed to clear all user code:', error);
  }
}

// ============================================
// PROGRESS STORAGE
// ============================================

export type QuestionStatus = 'not_started' | 'attempted' | 'solved';

interface ProgressStorage {
  [questionId: string]: {
    status: QuestionStatus;
    solvedAt?: string; // ISO date string
    attempts: number;
  };
}

// Mark a question as attempted
export function markAttempted(questionId: string | number): void {
  try {
    const progress = getProgressStorage();
    const qid = String(questionId);
    
    if (!progress[qid]) {
      progress[qid] = { status: 'attempted', attempts: 1 };
    } else if (progress[qid].status !== 'solved') {
      progress[qid].status = 'attempted';
      progress[qid].attempts = (progress[qid].attempts || 0) + 1;
    }
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to mark attempted:', error);
  }
}

// Mark a question as solved
export function markSolved(questionId: string | number): void {
  try {
    const progress = getProgressStorage();
    const qid = String(questionId);
    
    progress[qid] = {
      status: 'solved',
      solvedAt: new Date().toISOString(),
      attempts: (progress[qid]?.attempts || 0) + 1,
    };
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to mark solved:', error);
  }
}

// Get status for a specific question
export function getQuestionStatus(questionId: string | number): QuestionStatus {
  try {
    const progress = getProgressStorage();
    return progress[String(questionId)]?.status || 'not_started';
  } catch {
    return 'not_started';
  }
}

// Get progress for a specific question
export function getQuestionProgress(questionId: string | number): ProgressStorage[string] | null {
  try {
    const progress = getProgressStorage();
    return progress[String(questionId)] || null;
  } catch {
    return null;
  }
}

// Get all progress
function getProgressStorage(): ProgressStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Get total stats
export function getProgressStats(): { total: number; solved: number; attempted: number } {
  try {
    const progress = getProgressStorage();
    const entries = Object.values(progress);
    
    return {
      total: entries.length,
      solved: entries.filter(p => p.status === 'solved').length,
      attempted: entries.filter(p => p.status === 'attempted').length,
    };
  } catch {
    return { total: 0, solved: 0, attempted: 0 };
  }
}

// Get list of solved question IDs
export function getSolvedQuestionIds(): string[] {
  try {
    const progress = getProgressStorage();
    return Object.entries(progress)
      .filter(([_, p]) => p.status === 'solved')
      .map(([id, _]) => id);
  } catch {
    return [];
  }
}

// Reset progress for a specific question
export function resetQuestionProgress(questionId: string | number): void {
  try {
    const progress = getProgressStorage();
    delete progress[String(questionId)];
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}

// Reset all progress
export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  } catch (error) {
    console.error('Failed to reset all progress:', error);
  }
}

// ============================================
// SETTINGS STORAGE
// ============================================

interface SettingsStorage {
  theme?: 'light' | 'dark';
  fontSize?: number;
  autoSave?: boolean;
  showLineNumbers?: boolean;
}

const DEFAULT_SETTINGS: SettingsStorage = {
  theme: 'dark',
  fontSize: 14,
  autoSave: true,
  showLineNumbers: true,
};

// Get settings
export function getSettings(): SettingsStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Update settings
export function updateSettings(updates: Partial<SettingsStorage>): void {
  try {
    const current = getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update settings:', error);
  }
}

// ============================================
// UTILITY
// ============================================

// Clear all SQL Navigator data from localStorage
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}

// Export all data (for backup)
export function exportAllData(): string {
  try {
    const data = {
      userCode: getUserCodeStorage(),
      progress: getProgressStorage(),
      settings: getSettings(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  } catch {
    return '{}';
  }
}

// Import data (restore backup)
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.userCode) {
      localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(data.userCode));
    }
    if (data.progress) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
