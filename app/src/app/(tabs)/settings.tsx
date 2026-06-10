import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  Modal, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../constants/themeColors';
import { parahs } from '../../utils/parahData';
import { Sun, Moon, Sparkles, Bell, Download, Upload, Trash2, Link, ChevronDown, ChevronUp } from 'lucide-react-native';

export default function SettingsScreen() {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportDataJson,
    importData,
    loading
  } = useApp();

  // Local States
  const [linksExpanded, setLinksExpanded] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupJsonText, setBackupJsonText] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0D1117' }]}>
        <ActivityIndicator size="large" color="#3FB68A" />
      </View>
    );
  }

  const theme = themeColors[settings.theme || 'dark'];

  // Handle custom link changes
  const handleLinkChange = (parahNum: number, value: string) => {
    const updatedLinks = { ...settings.customLinks };
    if (value.trim() === '') {
      delete updatedLinks[parahNum];
    } else {
      updatedLinks[parahNum] = value;
    }
    updateSettings({ customLinks: updatedLinks });
  };

  const handleNotificationToggle = (value: boolean) => {
    // Basic native notification permissions could be fetched, 
    // for MVP we toggle local preference switch
    updateSettings({ notificationsEnabled: value });
    if (value) {
      Alert.alert("Reminders Enabled", "Daily reading reminders will be sent to help you stay on track.");
    }
  };

  const openExportModal = () => {
    const json = exportDataJson();
    setBackupJsonText(json);
    setIsImportMode(false);
    setShowBackupModal(true);
  };

  const openImportModal = () => {
    setBackupJsonText('');
    setIsImportMode(true);
    setShowBackupModal(true);
  };

  const handleImportSubmit = async () => {
    if (!backupJsonText.trim()) return;
    const result = await importData(backupJsonText);
    if (result.success) {
      Alert.alert('Success', 'Backup restored successfully!');
      setShowBackupModal(false);
    } else {
      Alert.alert('Error', result.error || 'Failed to restore backup');
    }
  };

  const handleReset = async () => {
    await resetAllData();
    setShowResetConfirm(false);
    Alert.alert('Reset Complete', 'All progress and settings have been cleared.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.pageTitle, { color: theme.text }]}>Settings & Preferences</Text>

        {/* Themes */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>AESTHETICS & THEME</Text>
          
          <View style={styles.themesRow}>
            <TouchableOpacity
              onPress={() => updateSettings({ theme: 'light' })}
              style={[
                styles.themeBtn,
                { borderColor: theme.border },
                settings.theme === 'light' && { backgroundColor: theme.accent + '10', borderColor: theme.accent }
              ]}
            >
              <Sun size={18} color={settings.theme === 'light' ? theme.accent : theme.textMuted} />
              <Text style={[styles.themeBtnText, { color: settings.theme === 'light' ? theme.accent : theme.textMuted }]}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateSettings({ theme: 'dark' })}
              style={[
                styles.themeBtn,
                { borderColor: theme.border },
                settings.theme === 'dark' && { backgroundColor: theme.accent + '10', borderColor: theme.accent }
              ]}
            >
              <Moon size={18} color={settings.theme === 'dark' ? theme.accent : theme.textMuted} />
              <Text style={[styles.themeBtnText, { color: settings.theme === 'dark' ? theme.accent : theme.textMuted }]}>Dark</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateSettings({ theme: 'night' })}
              style={[
                styles.themeBtn,
                { borderColor: theme.border },
                settings.theme === 'night' && { backgroundColor: theme.accent + '15', borderColor: theme.accent }
              ]}
            >
              <Sparkles size={18} color={settings.theme === 'night' ? theme.accent : theme.textMuted} />
              <Text style={[styles.themeBtnText, { color: settings.theme === 'night' ? theme.accent : theme.textMuted }]}>Night</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calculation and Tracking Preferences */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>TRACKING METHOD</Text>
          
          <View style={styles.verticalOptionGroup}>
            {[
              { id: 'hijri', label: 'Islamic (Hijri) Day', desc: "Juz matches active Hijri date (e.g. 14th = Juz 14)." },
              { id: 'gregorian', label: 'English (Gregorian) Day', desc: "Juz matches English date, day 31 cycles to Juz 1." },
              { id: 'cycle', label: 'Cycle From Start Date', desc: "Cycles Juz 1 to 30 sequentially from your start date." }
            ].map((method) => {
              const active = (settings.calculationMethod || 'hijri') === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => updateSettings({ calculationMethod: method.id as any })}
                  style={[
                    styles.methodBtn,
                    { borderColor: theme.border, backgroundColor: theme.bgSecondary + '25' },
                    active && { borderColor: theme.accent, backgroundColor: theme.accent + '10' }
                  ]}
                >
                  <Text style={[styles.methodLabel, { color: active ? theme.accent : theme.text }]}>
                    {method.label}
                  </Text>
                  <Text style={[styles.methodDesc, { color: theme.textMuted }]}>{method.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Conditional Start Date Field */}
          {settings.calculationMethod === 'cycle' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>START TRACKING DATE</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.bgSecondary + '35', borderColor: theme.border, color: theme.text }]}
                value={settings.startDate}
                onChangeText={(text) => updateSettings({ startDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textMuted + '60'}
              />
              <Text style={[styles.inputHelp, { color: theme.textMuted }]}>Format: YYYY-MM-DD (e.g. 2026-06-10)</Text>
            </View>
          )}

          {/* Target Reading Hour */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>TARGET READING TIME</Text>
            <View style={styles.readingTimeRow}>
              {[
                { id: 'morning', label: 'Fajr' },
                { id: 'afternoon', label: 'Zuhr' },
                { id: 'evening', label: 'Asr/Maghrib' },
                { id: 'night', label: 'Isha' }
              ].map((time) => {
                const active = settings.readingTime === time.id;
                return (
                  <TouchableOpacity
                    key={time.id}
                    onPress={() => updateSettings({ readingTime: time.id })}
                    style={[
                      styles.pillBtn,
                      { borderColor: theme.border, backgroundColor: theme.bgSecondary + '35' },
                      active && { borderColor: theme.accent, backgroundColor: theme.accent + '10' }
                    ]}
                  >
                    <Text style={[styles.pillText, { color: active ? theme.accent : theme.text }]}>{time.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Date formats display */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>DATE DISPLAY FORMAT</Text>
            <View style={styles.readingTimeRow}>
              {[
                { id: 'islamic', label: 'Islamic' },
                { id: 'both', label: 'Both' },
                { id: 'gregorian', label: 'English' }
              ].map((format) => {
                const active = settings.dateFormat === format.id;
                return (
                  <TouchableOpacity
                    key={format.id}
                    onPress={() => updateSettings({ dateFormat: format.id as any })}
                    style={[
                      styles.pillBtn,
                      { borderColor: theme.border, backgroundColor: theme.bgSecondary + '35' },
                      active && { borderColor: theme.accent, backgroundColor: theme.accent + '10' }
                    ]}
                  >
                    <Text style={[styles.pillText, { color: active ? theme.accent : theme.text }]}>{format.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notifications Preference */}
        <View style={[styles.card, styles.switchCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.switchLabelContainer}>
            <Bell size={18} color={theme.accent} style={styles.switchIcon} />
            <View>
              <Text style={[styles.switchTitle, { color: theme.text }]}>READING REMINDERS</Text>
              <Text style={[styles.switchDesc, { color: theme.textMuted }]}>Receive daily local status alerts.</Text>
            </View>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: theme.bgSecondary, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        {/* Expandable Custom Links */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border, padding: 0 }]}>
          <TouchableOpacity
            onPress={() => setLinksExpanded(!linksExpanded)}
            style={styles.accordionHeader}
          >
            <View style={styles.accordionTitleContainer}>
              <Link size={16} color={theme.accent} />
              <Text style={[styles.accordionTitle, { color: theme.text }]}>CUSTOM VIDEO OVERRIDES</Text>
            </View>
            {linksExpanded ? <ChevronUp size={18} color={theme.textMuted} /> : <ChevronDown size={18} color={theme.textMuted} />}
          </TouchableOpacity>

          {linksExpanded ? (
            <View style={[styles.accordionContent, { borderTopColor: theme.border }]}>
              <Text style={[styles.accordionDesc, { color: theme.textMuted }]}>
                Add custom YouTube links per Juz. If left empty, default playlist index is launched.
              </Text>
              
              <View style={styles.customLinksGrid}>
                {parahs.map((parah) => (
                  <View key={parah.number} style={styles.linkInputRow}>
                    <Text style={[styles.linkLabel, { color: theme.textMuted }]}>Juz {parah.number}</Text>
                    <TextInput
                      style={[styles.linkTextInput, { backgroundColor: theme.bgSecondary + '30', borderColor: theme.border, color: theme.text }]}
                      value={settings.customLinks[parah.number] || ''}
                      onChangeText={(text) => handleLinkChange(parah.number, text)}
                      placeholder="Default playlist index URL"
                      placeholderTextColor={theme.textMuted + '60'}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {/* Data Maintenance */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>DATA MAINTENANCE</Text>

          <View style={styles.maintenanceRow}>
            {/* Backup Export */}
            <TouchableOpacity
              onPress={openExportModal}
              style={[styles.maintenanceBtn, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '20' }]}
            >
              <Download size={16} color={theme.text} />
              <Text style={[styles.maintenanceBtnText, { color: theme.text }]}>Export Backup</Text>
            </TouchableOpacity>

            {/* Backup Import */}
            <TouchableOpacity
              onPress={openImportModal}
              style={[styles.maintenanceBtn, { borderColor: theme.border, backgroundColor: theme.bgSecondary + '20' }]}
            >
              <Upload size={16} color={theme.text} />
              <Text style={[styles.maintenanceBtnText, { color: theme.text }]}>Import Backup</Text>
            </TouchableOpacity>
          </View>

          {/* Reset Progress */}
          {!showResetConfirm ? (
            <TouchableOpacity
              onPress={() => setShowResetConfirm(true)}
              style={[styles.resetBtn, { borderColor: theme.statusNo + '40', backgroundColor: theme.statusNo + '08' }]}
            >
              <Trash2 size={16} color={theme.statusNo} />
              <Text style={[styles.resetBtnText, { color: theme.statusNo }]}>Reset All Data & Settings</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.confirmContainer, { borderColor: theme.statusNo, backgroundColor: theme.statusNo + '08' }]}>
              <Text style={[styles.confirmText, { color: theme.statusNo }]}>
                ARE YOU SURE? THIS CANNOT BE UNDONE.
              </Text>
              <View style={styles.confirmBtnRow}>
                <TouchableOpacity onPress={handleReset} style={[styles.confirmBtn, { backgroundColor: theme.statusNo }]}>
                  <Text style={styles.confirmBtnTextYes}>Yes, Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowResetConfirm(false)} style={[styles.confirmBtn, { backgroundColor: theme.bgSecondary }]}>
                  <Text style={[styles.confirmBtnTextNo, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Backup Modal Popup */}
        <Modal
          visible={showBackupModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBackupModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {isImportMode ? 'Import Backup Data' : 'Export Backup Data'}
              </Text>
              
              <Text style={[styles.modalDesc, { color: theme.textMuted }]}>
                {isImportMode 
                  ? 'Paste your JSON backup data below and click Import.' 
                  : 'Copy the JSON backup string below and save it somewhere safe.'
                }
              </Text>

              <TextInput
                style={[
                  styles.modalTextInput, 
                  { 
                    backgroundColor: theme.bgSecondary + '35', 
                    borderColor: theme.border, 
                    color: theme.text 
                  }
                ]}
                multiline
                value={backupJsonText}
                onChangeText={setBackupJsonText}
                selectTextOnFocus={!isImportMode}
                editable={isImportMode}
                placeholder="Paste JSON content here..."
                placeholderTextColor={theme.textMuted + '60'}
              />

              <View style={styles.modalBtnRow}>
                {isImportMode ? (
                  <TouchableOpacity 
                    onPress={handleImportSubmit} 
                    style={[styles.modalActionBtn, { backgroundColor: theme.accent }]}
                  >
                    <Text style={styles.modalActionBtnText}>Import</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity 
                  onPress={() => setShowBackupModal(false)} 
                  style={[styles.modalActionBtn, { backgroundColor: theme.bgSecondary }]}
                >
                  <Text style={[styles.modalActionBtnTextCancel, { color: theme.text }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={{ height: 30 }} />

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
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  themesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 6,
  },
  themeBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  verticalOptionGroup: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 14,
  },
  methodBtn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  methodLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  methodDesc: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
    lineHeight: 12,
  },
  inputContainer: {
    marginTop: 14,
  },
  inputLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  inputHelp: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  readingTimeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  switchIcon: {
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
  },
  switchDesc: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accordionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
  },
  accordionContent: {
    borderTopWidth: 1,
    padding: 20,
  },
  accordionDesc: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    lineHeight: 12,
    marginBottom: 14,
  },
  customLinksGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  linkInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkLabel: {
    width: 45,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  linkTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  maintenanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  maintenanceBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  maintenanceBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  resetBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resetBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  confirmContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  confirmBtnTextYes: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  confirmBtnTextNo: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
    textAlign: 'center',
  },
  modalTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 10,
    fontFamily: 'Courier',
    minHeight: 180,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalActionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  modalActionBtnTextCancel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  }
});
