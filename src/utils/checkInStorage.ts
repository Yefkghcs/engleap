const STORAGE_KEY = 'vocabulary_check_in';

interface CheckInRecord {
  date: string; // YYYY-MM-DD format
}

export const getCheckInRecords = (): CheckInRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addCheckIn = (): void => {
  const records = getCheckInRecords();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Check if already checked in today
  const existsToday = records.some(r => r.date === today);
  
  if (!existsToday) {
    records.push({ date: today });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const getTotalCheckInDays = (): number => {
  const records = getCheckInRecords();
  return records.length;
};

export const getThisWeekCheckInDays = (): number => {
  const records = getCheckInRecords();
  const today = new Date();
  
  // Get Monday of this week (ISO week starts on Monday)
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust when today is Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  
  // Count check-ins from Monday to today
  return records.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate >= monday && recordDate <= today;
  }).length;
};

export const getWeekCheckInStatus = (): boolean[] => {
  const records = getCheckInRecords();
  const today = new Date();
  
  // Get Monday of this week
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  
  // Create array for 7 days starting from Monday
  const weekStatus: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(monday);
    checkDate.setDate(monday.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    weekStatus.push(records.some(r => r.date === dateStr));
  }
  
  return weekStatus;
};

export const hasCheckedInToday = (): boolean => {
  const records = getCheckInRecords();
  const today = new Date().toISOString().split('T')[0];
  return records.some(r => r.date === today);
};
