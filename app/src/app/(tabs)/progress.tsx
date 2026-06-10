import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../constants/themeColors';
import { parahs } from '../../utils/parahData';
import { getLocalDateString } from '../../utils/hijriHelper';
import { ChevronLeft, ChevronRight, Flame, Trophy, CheckCircle, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CELL_WIDTH = (width - 32 - 12) / 7; // Screen padding and gaps

export default function ProgressScreen() {
  const {
    progress,
    getParahStatus,
    getStreaks,
    getCompletedCount,
    getPartialCount,
    setSelectedParahNum,
    loading,
    settings
  } = useApp();

  const { currentStreak, longestStreak } = getStreaks();
  const completedCount = getCompletedCount();
  const partialCount = getPartialCount();

  // Calendar navigation state (defaults to today's month/year)
  const today = new Date();
  const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0D1117' }]}>
        <ActivityIndicator size="large" color="#3FB68A" />
      </View>
    );
  }

  const theme = themeColors[settings?.theme || 'dark'];

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)

  const calendarDays: (Date | null)[] = [];
  // Placeholders for padding previous month's days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of current view month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return theme.statusComplete;
      case 'partial':
        return theme.statusPartial;
      case 'no':
        return theme.statusNo;
      default:
        return theme.border;
    }
  };

  const getGridBgColor = (status: string) => {
    switch (status) {
      case 'complete':
        return theme.statusComplete + '15';
      case 'partial':
        return theme.statusPartial + '15';
      case 'no':
        return theme.statusNo + '15';
      default:
        return theme.bgSecondary + '35';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.pageTitle, { color: theme.text }]}>Progress & History</Text>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <CheckCircle size={20} color={theme.statusComplete} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>COMPLETED</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Clock size={20} color={theme.statusPartial} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{partialCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>IN PROGRESS</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Flame size={20} color="#FF6B00" />
            <Text style={[styles.statNumber, { color: theme.text }]}>{currentStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>ACTIVE STREAK</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Trophy size={20} color={theme.gold} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>LONGEST STREAK</Text>
          </View>
        </View>

        {/* Lifetime Progress Bar */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>LIFETIME PROGRESS</Text>
            <Text style={[styles.progressPercent, { color: theme.accent }]}>
              {completedCount} / 30 ({Math.round((completedCount / 30) * 100)}%)
            </Text>
          </View>
          
          <View style={[styles.progressBarBg, { backgroundColor: theme.bgSecondary + '60', borderColor: theme.border }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: theme.accent,
                  width: `${(completedCount / 30) * 100}%`
                }
              ]} 
            />
          </View>
        </View>

        {/* 30-Parah Tracker Grid */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>30-PARAH TRACKER GRID</Text>

          <View style={styles.gridContainer}>
            {parahs.map((parah) => {
              const status = getParahStatus(parah.number);
              const statusColor = getStatusColor(status);
              const gridBgColor = getGridBgColor(status);
              
              return (
                <TouchableOpacity
                  key={parah.number}
                  onPress={() => setSelectedParahNum(parah.number)}
                  style={[
                    styles.gridCell,
                    { 
                      backgroundColor: gridBgColor, 
                      borderColor: status === 'untouched' ? theme.border : statusColor 
                    }
                  ]}
                >
                  <Text style={[
                    styles.gridNumber, 
                    { color: status === 'untouched' ? theme.text : statusColor }
                  ]}>
                    {parah.number}
                  </Text>
                  <Text 
                    style={[styles.gridName, { color: status === 'untouched' ? theme.textMuted : statusColor }]}
                    numberOfLines={1}
                  >
                    {parah.arabicName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Monthly Calendar View */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>MONTHLY CALENDAR</Text>
            
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={prevMonth} style={[styles.navBtn, { borderColor: theme.border }]}>
                <ChevronLeft size={16} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.monthText, { color: theme.text }]}>{monthName}</Text>
              <TouchableOpacity onPress={nextMonth} style={[styles.navBtn, { borderColor: theme.border }]}>
                <ChevronRight size={16} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Week headers */}
          <View style={styles.weekHeaderRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <Text key={day} style={[styles.weekDayLabel, { color: theme.textMuted }]}>{day}</Text>
            ))}
          </View>

          {/* Calendar Day Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((date, idx) => {
              if (date === null) {
                return <View key={`empty-${idx}`} style={styles.calendarDayCell} />;
              }
              
              const dateStr = getLocalDateString(date);
              const log = progress[dateStr];
              const status = log ? log.status : 'untouched';
              const statusColor = getStatusColor(status);
              const isTodayDate = dateStr === getLocalDateString(new Date());

              return (
                <TouchableOpacity
                  key={dateStr}
                  disabled={!log}
                  onPress={() => log && setSelectedParahNum(log.parah)}
                  style={[
                    styles.calendarDayCell,
                    { 
                      backgroundColor: isTodayDate ? theme.accent + '15' : theme.bgSecondary + '20',
                      borderColor: isTodayDate ? theme.accent : 'transparent',
                      borderWidth: isTodayDate ? 1 : 0
                    }
                  ]}
                >
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: status === 'untouched' ? 'transparent' : statusColor }
                  ]} />
                  <Text style={[
                    styles.dayText, 
                    { color: isTodayDate ? theme.accent : theme.text }
                  ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={[styles.legendRow, { borderTopColor: theme.border }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.statusComplete }]} />
              <Text style={[styles.legendText, { color: theme.textMuted }]}>Complete</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.statusPartial }]} />
              <Text style={[styles.legendText, { color: theme.textMuted }]}>Partial</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.statusNo }]} />
              <Text style={[styles.legendText, { color: theme.textMuted }]}>Not Yet</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 20 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

// Extract settings using context wrapper inside the component to prevent root crashes
const useAppSettingHook = () => {
  try {
    return useApp();
  } catch (e) {
    return { progress: {}, getParahStatus: () => 'untouched', getStreaks: () => ({currentStreak:0, longestStreak:0}), getCompletedCount: () => 0, getPartialCount: () => 0, setSelectedParahNum: () => {}, loading: false, settings: {theme:'dark'} } as any;
  }
};

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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
  },
  progressPercent: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridCell: {
    width: '18%', // Renders roughly 5 columns with flex gaps
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  gridNumber: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
  gridName: {
    fontSize: 9,
    fontFamily: 'Amiri_700Bold',
    marginTop: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
  },
  monthText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    minWidth: 100,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayLabel: {
    width: CELL_WIDTH,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 2,
    justifyContent: 'space-between',
  },
  calendarDayCell: {
    width: CELL_WIDTH,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    top: 4,
  },
  dayText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginTop: 6,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  }
});
