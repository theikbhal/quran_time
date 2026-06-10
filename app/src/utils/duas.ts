export interface Dua {
  arabic: string;
  english: string;
  source: string;
}

export const duas: Dua[] = [
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    english: "My Lord, increase me in knowledge.",
    source: "Surah Taha, 20:114"
  },
  {
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    english: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.",
    source: "Surah Al-Baqarah, 2:127"
  },
  {
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
    english: "My Lord, forgive and have mercy, for You are the best of those who show mercy.",
    source: "Surah Al-Muminun, 23:118"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    source: "Surah Al-Baqarah, 2:201"
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
    english: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
    source: "Surah Ali 'Imran, 3:8"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلاً",
    english: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    source: "Ibn Majah"
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    english: "My Lord, expand for me my breast [with assurance] and ease for me my task.",
    source: "Surah Taha, 20:25-26"
  }
];

export function getDailyDua(): Dua {
  const day = new Date().getDate();
  return duas[day % duas.length];
}
