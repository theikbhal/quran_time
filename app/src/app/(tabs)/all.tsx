import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../constants/themeColors';
import { parahs, Parah } from '../../utils/parahData';
import { FileText, ChevronRight } from 'lucide-react-native';

export default function AllParahsScreen() {
  const { getParahStatus, getParahNote, setSelectedParahNum, settings, loading } = useApp();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#0D1117' }]}>
        <ActivityIndicator size="large" color="#3FB68A" />
      </View>
    );
  }

  const theme = themeColors[settings.theme || 'dark'];

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

  const renderParahRow = ({ item }: { item: Parah }) => {
    const status = getParahStatus(item.number);
    const note = getParahNote(item.number);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity
        onPress={() => setSelectedParahNum(item.number)}
        style={[
          styles.row,
          { 
            backgroundColor: theme.bgCard, 
            borderColor: theme.border 
          }
        ]}
      >
        <View style={styles.rowLeft}>
          {/* Status Dot */}
          <View style={[
            styles.statusDot, 
            { 
              backgroundColor: status === 'untouched' ? 'transparent' : statusColor,
              borderColor: statusColor
            }
          ]} />
          
          <View style={styles.metaInfo}>
            <View style={styles.titleRow}>
              <Text style={[styles.juzNumber, { color: theme.text }]}>Juz {item.number}</Text>
              <Text style={[styles.transliteration, { color: theme.textMuted }]}>
                ({item.transliteration})
              </Text>
            </View>
            
            <Text style={[styles.rangeText, { color: theme.textMuted }]}>
              📖 {item.startSurah} {item.startAyah} → {item.endSurah} {item.endAyah}
            </Text>

            {note ? (
              <View style={[styles.notePreview, { backgroundColor: theme.accent + '10' }]}>
                <FileText size={10} color={theme.accent} style={styles.noteIcon} />
                <Text style={[styles.noteText, { color: theme.accent }]} numberOfLines={1}>
                  {note}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.rowRight}>
          <Text style={[styles.arabicName, { color: theme.accent }]}>
            {item.arabicName}
          </Text>
          <ChevronRight size={16} color={theme.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>All 30 Parahs</Text>
      
      <FlatList
        data={parahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderParahRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 14,
  },
  metaInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  juzNumber: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  transliteration: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  rangeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  notePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  noteIcon: {
    marginRight: 4,
  },
  noteText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arabicName: {
    fontSize: 22,
    fontFamily: 'Amiri_700Bold',
    textAlign: 'right',
    minWidth: 60,
  }
});
