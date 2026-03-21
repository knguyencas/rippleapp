import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';

const MOCK_LOGS = [
  { id: '1', date: new Date(2025, 9, 3),  moodEmoji: '😊', moodName: 'Tích cực',  moodColor: Colors.moodScale[8],  preview: 'Hôm nay khá ổn, hoàn thành được mấy task quan trọng...' },
  { id: '2', date: new Date(2025, 9, 1),  moodEmoji: '😐', moodName: 'Thờ ơ',    moodColor: Colors.moodScale[5],  preview: 'Ngày bình thường, không có gì đặc biệt xảy ra...' },
  { id: '3', date: new Date(2025, 8, 28), moodEmoji: '😔', moodName: 'Mệt mỏi',  moodColor: Colors.moodScale[3],  preview: 'Kiệt sức sau một tuần dài. Cần nghỉ ngơi nhiều hơn...' },
  { id: '4', date: new Date(2025, 8, 25), moodEmoji: '😄', moodName: 'Vui vẻ',   moodColor: Colors.moodScale[9],  preview: 'Gặp lại bạn bè sau lâu không gặp, cảm giác thật tuyệt...' },
  { id: '5', date: new Date(2025, 8, 20), moodEmoji: '😢', moodName: 'Buồn bã',  moodColor: Colors.moodScale[2],  preview: 'Có vài chuyện không như ý, tâm trạng xuống thấp...' },
  { id: '6', date: new Date(2025, 7, 15), moodEmoji: '🤩', moodName: 'Phấn khởi', moodColor: Colors.moodScale[10], preview: 'Ngày tuyệt vời nhất tháng, mọi thứ đều suôn sẻ...' },
  { id: '7', date: new Date(2025, 7, 10), moodEmoji: '😰', moodName: 'Lo âu',    moodColor: Colors.moodScale[3],  preview: 'Nhiều deadline cùng lúc, cảm thấy áp lực...' },
];

const MONTH_NAMES = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
const DAY_NAMES = ['CN','T2','T3','T4','T5','T6','T7'];

function groupByMonth(logs: typeof MOCK_LOGS) {
  const map = new Map<string, typeof MOCK_LOGS>();
  logs.forEach(log => {
    const key = `${log.date.getFullYear()}-${log.date.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(log);
  });
  return Array.from(map.entries()).map(([key, items]) => {
    const [year, month] = key.split('-').map(Number);
    return { label: `${MONTH_NAMES[month]} ${year}`, items };
  });
}

export default function JournalScreen() {
  const [showAll, setShowAll] = useState(false);
  const allLogs = MOCK_LOGS;
  const visibleLogs = showAll ? allLogs : allLogs.slice(0, 5);
  const groups = groupByMonth(visibleLogs);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <Text style={s.headerTitle}>Journal</Text>
          <Text style={s.headerSub}>Ghi lại hành trình cảm xúc của bạn</Text>
        </View>

        <View style={s.quickWrap}>
          <TouchableOpacity
            style={s.quickCard}
            onPress={() => router.push('/tabs/journal/new')}
          >
            <Text style={s.quickEmoji}>✍️</Text>
            <View style={s.quickText}>
              <Text style={s.quickTitle}>Cập nhật journal hôm nay</Text>
              <Text style={s.quickSub}>Bạn đang cảm thấy thế nào?</Text>
            </View>
            <Text style={s.quickArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {groups.map((group, gi) => (
          <View key={gi} style={s.monthSection}>
            <View style={s.monthHeader}>
              <View style={s.monthDot} />
              <Text style={s.monthLabel}>{group.label}</Text>
              <View style={s.monthLine} />
            </View>

            {group.items.map((log, idx) => {
              const globalIdx = allLogs.findIndex(l => l.id === log.id);
              const faded = !showAll && globalIdx >= 3;
              const dayName = DAY_NAMES[log.date.getDay()];
              const dateNum = log.date.getDate();

              return (
                <TouchableOpacity
                  key={log.id}
                  style={[s.logRow, faded && s.logRowFaded]}
                  onPress={() => !faded && router.push(`/tabs/journal/${log.id}`)}
                  activeOpacity={faded ? 1 : 0.7}
                >
                  <View style={s.timelineCol}>
                    <View style={[s.timelineDot, { backgroundColor: log.moodColor }]} />
                    {idx < group.items.length - 1 && <View style={s.timelineConnector} />}
                  </View>

                  <View style={s.logCard}>
                    <View style={s.logCardTop}>
                      <View style={[s.dateBadge, { backgroundColor: log.moodColor }]}>
                        <Text style={s.dateBadgeDay}>{dayName}</Text>
                        <Text style={s.dateBadgeNum}>{dateNum}</Text>
                      </View>
                      <View style={s.logMeta}>
                        <Text style={s.logMood}>{log.moodEmoji} {log.moodName}</Text>
                        <Text style={s.logPreview} numberOfLines={2}>{log.preview}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {!showAll && allLogs.length > 5 && (
          <TouchableOpacity style={s.viewAll} onPress={() => setShowAll(true)}>
            <Text style={s.viewAllText}>Xem tất cả {allLogs.length} entries →</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.foam },
  scroll: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  quickWrap: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.teal,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  quickEmoji: { fontSize: 28 },
  quickText: { flex: 1 },
  quickTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 3,
  },
  quickSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  quickArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  monthSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  monthDot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: Colors.teal,
  },
  monthLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  monthLine: {
    flex: 1, height: 1,
    backgroundColor: Colors.border,
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 14,
  },
  logRowFaded: {
    opacity: 0.35,
  },
  timelineCol: {
    width: 16,
    alignItems: 'center',
    paddingTop: 6,
  },
  timelineDot: {
    width: 12, height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  timelineConnector: {
    flex: 1, width: 2,
    backgroundColor: Colors.border,
    minHeight: 40,
  },
  logCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  logCardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  dateBadge: {
    width: 40, height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDay: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
  },
  dateBadgeNum: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textLight,
    lineHeight: 22,
  },
  logMeta: { flex: 1 },
  logMood: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  logPreview: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  viewAll: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 24,
  },
  viewAllText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.teal,
  },
});