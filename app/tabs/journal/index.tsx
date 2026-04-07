import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../../services/api';
import { MOODS } from '../../../components/mood/MoodWheel';
import { journalIndexStyles as s, J } from '../../../styles/journal.styles';

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
