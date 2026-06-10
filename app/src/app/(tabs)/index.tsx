import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Linking,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../constants/themeColors';
import { parahs, getDefaultVideoLink, fullQuranVideoLink, fullPlaylistLink } from '../../utils/parahData';
import { toHijri, formatHijri, getLocalDateString, getGregorianFormatted, calculateTodayParah } from '../../utils/hijriHelper';
import { getDailyDua } from '../../utils/duas';
import { Play, FileText, CheckCircle, Clock, XCircle, ExternalLink, Calendar } from 'lucide-react-native';

export default function TodayScreen() {
  const { settings, progress, updateProgress, loading } = useApp();
  
  const todayDateStr = getLocalDateString(new Date());
  const todayParahNum = calculateTodayParah(settings, new Date());
  const todayParah = parahs[todayParahNum - 1];
  
  const todayLog = progress[todayDateStr] || {};
  const currentStatus = todayLog.status || 'no';
  const currentNote = todayLog.note || '';

  const [noteText, setNoteText] = useState(currentNote);
  const [saveStatus, setSaveStatus] = useState('');
  const [dua, setDua] = useState({ arabic: '', english: '', source: '' });

  // Sync state with settings
  useEffect(() => {
    setNoteText(currentNote);
  }, [currentNote]);

  // Load supplication
  useEffect(() => {
    setDua(getDailyDua());
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0D1117' }]}>
        <ActivityIndicator size="large" color="#3FB68A" />
      </View>
    );
  }

  const theme = themeColors[settings.theme || 'dark'];

  const handleStatusChange = (status: 'complete' | 'partial' | 'no') => {
    updateProgress(todayDateStr, todayParahNum, status, noteText);
    triggerSaveIndicator('Status updated');
  };

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    updateProgress(todayDateStr, todayParahNum, currentStatus, text);
    triggerSaveIndicator('Notes saved');
  };

  const triggerSaveIndicator = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  };

  // Dates
  const hijriDate = toHijri(new Date());
  const hijriFormatted = formatHijri(hijriDate);
  const gregorianFormatted = getGregorianFormatted(new Date());

  const todayVideoLink = settings.customLinks[todayParahNum] || getDefaultVideoLink(todayParahNum);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Date Headers */}
        <View style={styles.header}>
          <View style={styles.dateRow}>
            <Calendar size={18} color={theme.accent} style={styles.dateIcon} />
            <Text style={[styles.hijriText, { color: theme.text }]}>
              {settings.dateFormat === 'gregorian' ? gregorianFormatted : hijriFormatted}
            </Text>
          </View>
          {settings.dateFormat === 'both' && (
            <Text style={[styles.gregorianText, { color: theme.textMuted }]}>
              {gregorianFormatted}
            </Text>
          )}
          {settings.dateFormat === 'islamic' && (
            <Text style={[styles.gregorianText, { color: theme.accent }]}>Islamic Calendar</Text>
          )}
          {settings.dateFormat === 'gregorian' && (
            <Text style={[styles.gregorianText, { color: theme.accent }]}>Gregorian Calendar</Text>
          )}
        </View>

        {/* Today's Reading Card */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={[styles.accentLine, { backgroundColor: theme.accent }]} />
          
          <Text style={[styles.cardLabel, { color: theme.gold }]}>TODAY'S READING</Text>
          <Text style={[styles.cardJuzNumber, { color: theme.textMuted }]}>
            Parah {todayParah.number} of 30
          </Text>

          <Text style={[styles.arabicName, { color: theme.accent }]}>
            {todayParah.arabicName}
          </Text>
          
          <Text style={[styles.transliteration, { color: theme.text }]}>
            {todayParah.transliteration}
          </Text>

          <View style={[styles.rangeContainer, { borderColor: theme.border }]}>
            <Text style={[styles.rangeText, { color: theme.text }]}>
              📖 {todayParah.startSurah} {todayParah.startAyah} → {todayParah.endSurah} {todayParah.endAyah}
            </Text>
          </View>
        </View>

        {/* Reading Status Selector */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>READING STATUS</Text>
            {saveStatus ? <Text style={[styles.saveStatus, { color: theme.accent }]}>{saveStatus}</Text> : null}
          </View>

          <View style={styles.statusRow}>
            {/* Complete */}
            <TouchableOpacity
              onPress={() => handleStatusChange('complete')}
              style={[
                styles.statusButton,
                { borderColor: theme.border },
                currentStatus === 'complete' && { 
                  backgroundColor: theme.statusComplete + '20', 
                  borderColor: theme.statusComplete 
                }
              ]}
            >
              <CheckCircle size={18} color={currentStatus === 'complete' ? theme.statusComplete : theme.textMuted} />
              <Text style={[
                styles.statusButtonText, 
                { color: currentStatus === 'complete' ? theme.statusComplete : theme.textMuted }
              ]}>
                Complete
              </Text>
            </TouchableOpacity>

            {/* Partial */}
            <TouchableOpacity
              onPress={() => handleStatusChange('partial')}
              style={[
                styles.statusButton,
                { borderColor: theme.border },
                currentStatus === 'partial' && { 
                  backgroundColor: theme.statusPartial + '20', 
                  borderColor: theme.statusPartial 
                }
              ]}
            >
              <Clock size={18} color={currentStatus === 'partial' ? theme.statusPartial : theme.textMuted} />
              <Text style={[
                styles.statusButtonText, 
                { color: currentStatus === 'partial' ? theme.statusPartial : theme.textMuted }
              ]}>
                Partial
              </Text>
            </TouchableOpacity>

            {/* Not Yet */}
            <TouchableOpacity
              onPress={() => handleStatusChange('no')}
              style={[
                styles.statusButton,
                { borderColor: theme.border },
                currentStatus === 'no' && { 
                  backgroundColor: theme.statusNo + '20', 
                  borderColor: theme.statusNo 
                }
              ]}
            >
              <XCircle size={18} color={currentStatus === 'no' ? theme.statusNo : theme.textMuted} />
              <Text style={[
                styles.statusButtonText, 
                { color: currentStatus === 'no' ? theme.statusNo : theme.textMuted }
              ]}>
                Not Yet
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reflections & Notes */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.sectionHeaderIcon}>
            <FileText size={16} color={theme.accent} />
            <Text style={[styles.sectionTitleIcon, { color: theme.text }]}>REFLECTIONS & NOTES</Text>
          </View>
          <TextInput
            style={[
              styles.notesInput, 
              { 
                backgroundColor: theme.bgSecondary + '40', 
                borderColor: theme.border, 
                color: theme.text 
              }
            ]}
            placeholder="Write down any notes, thoughts, or reflections on today's reading..."
            placeholderTextColor={theme.textMuted + '80'}
            multiline
            numberOfLines={3}
            value={noteText}
            onChangeText={handleNoteChange}
            textAlignVertical="top"
          />
        </View>

        {/* Media Resources */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>MEDIA RESOURCES</Text>

          <View style={styles.mediaContainer}>
            <TouchableOpacity
              onPress={() => openLink(todayVideoLink)}
              style={[styles.mediaRow, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '30' }]}
            >
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaEmoji}>📺</Text>
                <View>
                  <Text style={[styles.mediaTitle, { color: theme.text }]}>Watch Today's Parah</Text>
                  <Text style={[styles.mediaSub, { color: theme.textMuted }]}>
                    {settings.customLinks[todayParahNum] ? 'Custom Override' : 'Sabeel Quran YouTube'}
                  </Text>
                </View>
              </View>
              <Play size={16} color={theme.accent} fill={theme.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLink(fullPlaylistLink)}
              style={[styles.mediaRow, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '30' }]}
            >
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaEmoji}>🎦</Text>
                <View>
                  <Text style={[styles.mediaTitle, { color: theme.text }]}>Full Quran Playlist</Text>
                  <Text style={[styles.mediaSub, { color: theme.textMuted }]}>30 Videos Series</Text>
                </View>
              </View>
              <ExternalLink size={16} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLink(fullQuranVideoLink)}
              style={[styles.mediaRow, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '30' }]}
            >
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaEmoji}>🕋</Text>
                <View>
                  <Text style={[styles.mediaTitle, { color: theme.text }]}>Complete Quran Video</Text>
                  <Text style={[styles.mediaSub, { color: theme.textMuted }]}>Full 30 Juz Recitation</Text>
                </View>
              </View>
              <Play size={16} color={theme.gold} fill={theme.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Dua */}
        {dua.arabic ? (
          <View style={[styles.duaCard, { borderColor: theme.gold + '50', backgroundColor: theme.gold + '08' }]}>
            <Text style={[styles.duaLabel, { color: theme.gold }]}>DAILY SUPPLICATION</Text>
            <Text style={[styles.duaArabic, { color: theme.gold }]}>{dua.arabic}</Text>
            <Text style={[styles.duaEnglish, { color: theme.text }]}>"{dua.english}"</Text>
            <Text style={[styles.duaSource, { color: theme.textMuted }]}>{dua.source}</Text>
          </View>
        ) : null}

        {/* Spacer */}
        <View style={{ height: 20 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  hijriText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  gregorianText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardJuzNumber: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  arabicName: {
    fontSize: 48,
    fontFamily: 'Amiri_700Bold',
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 60,
  },
  transliteration: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  rangeContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
  },
  sectionTitleIcon: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginLeft: 6,
  },
  saveStatus: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 4,
  },
  statusButtonText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    minHeight: 80,
  },
  mediaContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 8,
  },
  mediaRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mediaEmoji: {
    fontSize: 20,
  },
  mediaTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  mediaSub: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  duaCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  duaLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  duaArabic: {
    fontSize: 24,
    fontFamily: 'Amiri_700Bold',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 8,
  },
  duaEnglish: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
  duaSource: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  }
});
