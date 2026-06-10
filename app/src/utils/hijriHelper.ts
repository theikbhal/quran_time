export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const monthNames = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul Qa'dah",
  "Dhul Hijjah"
];

export function toHijri(dateInput: Date | string | number): HijriDate {
  const date = new Date(dateInput);

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    let day = 1;
    let monthNum = 1;
    let year = 1446;
    
    for (const part of parts) {
      if (part.type === 'day') {
        day = parseInt(part.value, 10);
      } else if (part.type === 'month') {
        monthNum = parseInt(part.value, 10);
      } else if (part.type === 'year') {
        year = parseInt(part.value, 10);
      }
    }
    
    return {
      day,
      month: monthNum,
      year,
      monthName: monthNames[monthNum - 1] || "Unknown"
    };
  } catch (e) {
    return getHijriFallback(date);
  }
}

function getHijriFallback(date: Date): HijriDate {
  let jd = (date.getTime() / 86400000) + 2440587.5;
  let l = Math.floor(jd) - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  let m = Math.floor((24 * l) / 709);
  let d = l - Math.floor((709 * m) / 24);
  let y = 30 * n + j - 30;
  
  return {
    day: d,
    month: m,
    year: y,
    monthName: monthNames[m - 1] || "Unknown"
  };
}

export function formatHijri(hijri: HijriDate | null): string {
  if (!hijri) return "";
  return `${hijri.day} ${hijri.monthName} ${hijri.year} AH`;
}

export function getLocalDateString(date: Date | string | number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateTodayParah(settings: any, todayDateInput: Date | string | number): number {
  const today = new Date(todayDateInput);
  const method = settings.calculationMethod || 'hijri';
  
  if (method === 'hijri') {
    const hijri = toHijri(today);
    return Math.min(30, Math.max(1, hijri.day));
  }
  
  if (method === 'gregorian') {
    const day = today.getDate();
    return ((day - 1) % 30) + 1;
  }
  
  // Default: 'cycle'
  const start = new Date(settings.startDate || getLocalDateString(new Date()));
  start.setHours(0, 0, 0, 0);
  
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);
  
  const diffTime = todayMidnight.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const parahIndex = ((diffDays % 30) + 30) % 30;
  return parahIndex + 1;
}

export function getGregorianFormatted(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
