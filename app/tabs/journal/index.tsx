import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Platform } from 'react-native';
import api from '../../../services/api';
import { MOODS } from '../../../components/mood/MoodWheel';

const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(44,51,24,0.07)' }
  : { shadowColor: '#2C3318', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 };

interface Log {
  id: string;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

function getMoodEmoji(moodName: string): string {
  const found = MOODS.find(m => m.name.toLowerCase() === moodName?.toLowerCase());
  return found?.emoji ?? '';
}

function groupByMonth(logs: Log[]) {
  const groups: { key: string; label: string; logs: Log[] }[] = [];
  const map: Record<string, number> = {};
  logs.forEach(log => {
    const date  = new Date(log.createdAt);
    const key   = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (map[key] === undefined) {
      map[key] = groups.length;
      groups.push({ key, label, logs: [] });
    }
    groups[map[key]].logs.push(log);
  });
  return groups;
}

const J = {
  bg:           '#F7F5EE',
  illustBg:     '#C8DEB0',
  card:         '#FFFFFF',
  textPrimary:  '#2C3318',
  textMuted:    '#7A8C5E',
  textLight:    '#A8B898',
  btnBg:        '#3D5C28',
  btnText:      '#FFFFFF',
  divider:      '#E5E8DD',
  shadow: {
    shadowColor: '#2C3318',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
};

export default function JournalScreen() {
  const router = useRouter();
  const [logs, setLogs]           = useState<Log[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayLogId, setTodayLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const [logsRes, todayRes] = await Promise.all([
        api.get('/logs?limit=50'),
        api.get('/logs/today'),
      ]);
      setLogs(logsRes.data ?? []);
      setTodayLogId(todayRes.data?.log?.id ?? null);
    } catch (e) {
      console.error('fetchLogs error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLogs(); }, []));
  const onRefresh = () => { setRefreshing(true); fetchLogs(); };

  const goWrite = () =>
    todayLogId
      ? router.push(`/tabs/journal/${todayLogId}?edit=true`)
      : router.push('/tabs/journal/new');

  const grouped = groupByMonth(logs);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={J.btnBg} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={J.btnBg} />
        }
      >

        <View style={s.illustWrap}>

          <View style={s.illustPlaceholder} />
          <Text style={s.pageTitle}>Journal</Text>
        </View>

        <View style={s.actionSection}>

          <TouchableOpacity style={s.actionCard} onPress={goWrite} activeOpacity={0.85}>
            <View style={s.actionCardLeft}>
              <Text style={s.actionCardTitle}>
                {todayLogId ? 'Chỉnh sửa nhật ký hôm nay' : 'Ghi lại cảm xúc & suy nghĩ của bạn'}
              </Text>
              <TouchableOpacity style={s.actionBtn} onPress={goWrite}>
                <Text style={s.actionBtnText}>
                  {todayLogId ? 'Tiếp tục viết' : 'Bắt đầu viết'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={s.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.actionCard} onPress={() => router.push('/tabs/journal/new')} activeOpacity={0.85}>
            <View style={s.actionCardLeft}>
              <Text style={s.actionCardTitle}>Lưu lại những khoảnh khắc yêu thích</Text>
              <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/tabs/journal/new')}>
                <Text style={s.actionBtnText}>Thêm ảnh</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.actionChevron}>›</Text>
          </TouchableOpacity>

        </View>

        {logs.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}></Text>
            <Text style={s.emptyTitle}>Chưa có nhật ký nào</Text>
            <Text style={s.emptyText}>Hãy ghi lại cảm xúc đầu tiên của bạn!</Text>
          </View>
        ) : (
          grouped.map(({ key, label, logs: monthLogs }) => (
            <View key={key} style={s.monthSection}>

              <Text style={s.monthTitle}>{label}</Text>


              {monthLogs.map((log, idx) => {
                const date    = new Date(log.createdAt);
                const isToday = new Date().toDateString() === date.toDateString();
                const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
                const day     = date.getDate();
                return (
                  <TouchableOpacity
                    key={log.id}
                    style={[
                      s.entryRow,
                      idx < monthLogs.length - 1 && s.entryRowBorder,
                      isToday && s.entryRowToday,
                    ]}
                    onPress={() => router.push(`/tabs/journal/${log.id}`)}
                    activeOpacity={0.7}
                  >

                    <View style={s.dateCol}>
                      <Text style={s.dateWeekday}>{weekday}</Text>
                      <Text style={s.dateDay}>{day}</Text>
                    </View>

                    <View style={s.entryContent}>
                      {log.note ? (
                        <Text style={s.entryText} numberOfLines={3}>
                          {log.note}
                        </Text>
                      ) : (
                        <Text style={s.entryEmpty}>
                          {getMoodEmoji(log.mood)}  {log.mood}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: J.bg },

  illustWrap: {
    backgroundColor: J.illustBg,
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  illustPlaceholder: {
    width: '100%',
    height: 200,
  },
  illustImg: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  pageTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: J.textPrimary,
    marginTop: 4,
    marginBottom: 8,
  },

  actionSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  actionCard: {
    backgroundColor: J.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  actionCardLeft: { flex: 1, gap: 12 },
  actionCardTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: J.textPrimary,
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: J.btnBg,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: J.btnText,
  },
  actionChevron: {
    fontSize: 24,
    color: J.textLight,
    marginLeft: 8,
  },

  monthSection: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  monthTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: J.textPrimary,
    marginBottom: 12,
  },

  entryRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'flex-start',
    gap: 14,
  },
  entryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: J.divider,
  },
  entryRowToday: {
    backgroundColor: '#F0F7E8',
    borderRadius: 12,
    paddingHorizontal: 8,
  },

  dateCol: {
    width: 36,
    alignItems: 'center',
    paddingTop: 2,
  },
  dateWeekday: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: J.textMuted,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: J.textPrimary,
    lineHeight: 26,
  },

  entryContent: { flex: 1 },
  entryText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: J.textMuted,
    lineHeight: 20,
  },
  entryEmpty: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: J.textLight,
    fontStyle: 'italic',
  },


  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: J.textPrimary,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: J.textMuted,
    textAlign: 'center',
  },
});
