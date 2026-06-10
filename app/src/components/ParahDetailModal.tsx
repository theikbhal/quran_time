import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Linking
} from 'react-native';
import { useApp } from '../context/AppContext';
import { themeColors } from '../constants/themeColors';
import { parahs, getDefaultVideoLink } from '../utils/parahData';
import { getLocalDateString } from '../utils/hijriHelper';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Play, Link } from 'lucide-react-native';

export default function ParahDetailModal() {
  const {
    selectedParahNum,
    setSelectedParahNum,
    progress,
    updateProgress,
    settings,
    updateSettings
  } = useApp();

  // Return null if modal closed
  if (!selectedParahNum) return null;

  const parah = parahs[selectedParahNum - 1];

  // Fetch log details
  const getLogDetails = () => {
    let latestDate = null;
    let latestLog = null;
    
    for (const [dateStr, log] of Object.entries(progress)) {
      if (log.parah === selectedParahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestDate = dateStr;
          latestLog = log;
        }
      }
    }
    
    return {
      dateStr: latestDate || getLocalDateString(new Date()),
      status: latestLog ? latestLog.status : 'no',
      note: latestLog ? latestLog.note : ''
    };
  };

  const { dateStr, status: currentStatus, note: currentNote } = getLogDetails();

  const [noteText, setNoteText] = useState(currentNote);
  const [customLink, setCustomLink] = useState(settings.customLinks[selectedParahNum] || '');

  useEffect(() => {
    setNoteText(currentNote);
    setCustomLink(settings.customLinks[selectedParahNum] || '');
  }, [selectedParahNum, currentStatus, currentNote, settings.customLinks]);

  const theme = themeColors[settings.theme || 'dark'];

  const handleStatusChange = (status: 'complete' | 'partial' | 'no') => {
    updateProgress(dateStr, selectedParahNum, status, noteText);
  };

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    updateProgress(dateStr, selectedParahNum, currentStatus, text);
  };

  const handleCustomLinkChange = (text: string) => {
    setCustomLink(text);
    const updatedLinks = { ...settings.customLinks };
    if (text.trim() === '') {
      delete updatedLinks[selectedParahNum];
    } else {
      updatedLinks[selectedParahNum] = text;
    }
    updateSettings({ customLinks: updatedLinks });
  };

  const handlePrev = () => {
    if (selectedParahNum > 1) {
      setSelectedParahNum(selectedParahNum - 1);
    }
  };

  const handleNext = () => {
    if (selectedParahNum < 30) {
      setSelectedParahNum(selectedParahNum + 1);
    }
  };

  const videoLink = settings.customLinks[selectedParahNum] || getDefaultVideoLink(selectedParahNum);

  const openVideo = async () => {
    const supported = await Linking.canOpenURL(videoLink);
    if (supported) {
      await Linking.openURL(videoLink);
    }
  };

  return (
    <Modal
      visible={selectedParahNum !== null}
      transparent
      animationType="slide"
      onRequestClose={() => setSelectedParahNum(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          
          {/* Close button */}
          <TouchableOpacity 
            onPress={() => setSelectedParahNum(null)}
            style={[styles.closeBtn, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '30' }]}
          >
            <X size={16} color={theme.text} />
          </TouchableOpacity>

          {/* Navigation header */}
          <View style={[styles.modalNavHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity 
              onPress={handlePrev} 
              disabled={selectedParahNum === 1}
              style={[styles.navBtn, selectedParahNum === 1 && { opacity: 0.2 }]}
            >
              <ChevronLeft size={16} color={theme.text} />
              <Text style={[styles.navBtnText, { color: theme.text }]}>Prev</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.gold }]}>Juz {selectedParahNum} of 30</Text>

            <TouchableOpacity 
              onPress={handleNext} 
              disabled={selectedParahNum === 30}
              style={[styles.navBtn, selectedParahNum === 30 && { opacity: 0.2 }]}
            >
              <Text style={[styles.navBtnText, { color: theme.text }]}>Next</Text>
              <ChevronRight size={16} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Quranic Metadata */}
          <View style={styles.quranInfo}>
            <Text style={[styles.arabicName, { color: theme.accent }]}>
              {parah.arabicName}
            </Text>
            <Text style={[styles.transliteration, { color: theme.text }]}>
              {parah.transliteration}
            </Text>
            <View style={[styles.rangeBox, { backgroundColor: theme.bgSecondary + '20', borderColor: theme.border }]}>
              <Text style={[styles.rangeText, { color: theme.text }]}>
                📖 {parah.startSurah} {parah.startAyah} → {parah.endSurah} {parah.endAyah}
              </Text>
            </View>
          </View>

          {/* Status buttons */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>READING STATUS</Text>
            <View style={styles.statusRow}>
              {/* Complete */}
              <TouchableOpacity
                onPress={() => handleStatusChange('complete')}
                style={[
                  styles.statusBtn,
                  { borderColor: theme.border },
                  currentStatus === 'complete' && { backgroundColor: theme.statusComplete + '20', borderColor: theme.statusComplete }
                ]}
              >
                <CheckCircle size={16} color={currentStatus === 'complete' ? theme.statusComplete : theme.textMuted} />
                <Text style={[styles.statusBtnText, { color: currentStatus === 'complete' ? theme.statusComplete : theme.textMuted }]}>
                  Complete
                </Text>
              </TouchableOpacity>

              {/* Partial */}
              <TouchableOpacity
                onPress={() => handleStatusChange('partial')}
                style={[
                  styles.statusBtn,
                  { borderColor: theme.border },
                  currentStatus === 'partial' && { backgroundColor: theme.statusPartial + '20', borderColor: theme.statusPartial }
                ]}
              >
                <Clock size={16} color={currentStatus === 'partial' ? theme.statusPartial : theme.textMuted} />
                <Text style={[styles.statusBtnText, { color: currentStatus === 'partial' ? theme.statusPartial : theme.textMuted }]}>
                  Partial
                </Text>
              </TouchableOpacity>

              {/* Not Yet */}
              <TouchableOpacity
                onPress={() => handleStatusChange('no')}
                style={[
                  styles.statusBtn,
                  { borderColor: theme.border },
                  currentStatus === 'no' && { backgroundColor: theme.statusNo + '20', borderColor: theme.statusNo }
                ]}
              >
                <XCircle size={16} color={currentStatus === 'no' ? theme.statusNo : theme.textMuted} />
                <Text style={[styles.statusBtnText, { color: currentStatus === 'no' ? theme.statusNo : theme.textMuted }]}>
                  Not Yet
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reflections/Notes Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>REFLECTIONS & NOTES</Text>
            <TextInput
              style={[
                styles.notesInput, 
                { 
                  backgroundColor: theme.bgSecondary + '35', 
                  borderColor: theme.border, 
                  color: theme.text 
                }
              ]}
              value={noteText}
              onChangeText={handleNoteChange}
              placeholder="Write reflections for this Parah..."
              placeholderTextColor={theme.textMuted + '60'}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          {/* Play & Custom Override Links */}
          <View style={[styles.section, styles.borderTop, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              onPress={openVideo}
              style={[styles.playBtn, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '20' }]}
            >
              <Play size={16} color={theme.text} fill={theme.text} />
              <Text style={[styles.playBtnText, { color: theme.text }]}>Watch Parah {selectedParahNum} Video</Text>
            </TouchableOpacity>

            <View style={styles.overrideInputContainer}>
              <View style={styles.overrideLabelContainer}>
                <Link size={14} color={theme.accent} />
                <Text style={[styles.overrideLabel, { color: theme.textMuted }]}>OVERRIDE LINK FOR THIS PARAH</Text>
              </View>
              <TextInput
                style={[
                  styles.overrideInput,
                  { 
                    backgroundColor: theme.bgSecondary + '30', 
                    borderColor: theme.border, 
                    color: theme.text 
                  }
                ]}
                value={customLink}
                onChangeText={handleCustomLinkChange}
                placeholder="Paste custom YouTube link here"
                placeholderTextColor={theme.textMuted + '60'}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    paddingTop: 36,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    zIndex: 10,
  },
  modalNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  navBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  modalTitle: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  quranInfo: {
    alignItems: 'center',
    marginVertical: 18,
  },
  arabicName: {
    fontSize: 44,
    fontFamily: 'Amiri_700Bold',
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  rangeBox: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rangeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 4,
  },
  statusBtnText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    minHeight: 56,
  },
  borderTop: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 6,
  },
  playBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  playBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  overrideInputContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  overrideLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overrideLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
  },
  overrideInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  }
});
