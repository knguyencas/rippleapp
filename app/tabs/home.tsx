import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeStyles as s } from '../../styles/home.styles';
import { useAuthStore } from '../../stores/auth.store';
import { MOODS } from '../../components/mood/MoodWheel';
import api from '../../services/api';

const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(26,58,92,0.07)' }
  : { shadowColor: '#1A3A5C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 };

interface TodayLog {
  id: string;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

function getMoodInfo(moodName: string) {
  return MOODS.find(m => m.name.toLowerCase() === moodName?.toLowerCase()) ?? null;
}

const HABITS = [
  { emoji: '', name: 'Uống nước',  sub: 'Mục tiêu 8 ly/ngày' },
  { emoji: '', name: 'Ngủ đủ giấc', sub: 'Mục tiêu 7-8 tiếng' },
  { emoji: '', name: 'Vận động',   sub: 'Đi bộ 30 phút' },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [todayLog, setTodayLog]   = useState<TodayLog | null>(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const [habits, setHabits]       = useState([false, false, false]);
  const [stats, setStats]         = useState({ streak: 0, avgMood: '—', totalDays: 0 });

  const displayName = user?.displayName || user?.username || 'bạn';
  const initials    = displayName.slice(0, 2).toUpperCase();

  const toggleHabit = (i: number) =>
    setHabits(prev => prev.map((v, idx) => idx === i ? !v : v));

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };


  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoadingLog(true);
        try {
          const [todayRes, logsRes] = await Promise.all([
            api.get('/logs/today'),
            api.get('/logs?limit=7'),
          ]);

          if (!active) return;

          setTodayLog(todayRes.data?.log ?? null);


          const logs: TodayLog[] = logsRes.data ?? [];
          if (logs.length > 0) {
            const avg = logs.reduce((s, l) => s + l.moodScore, 0) / logs.length;
            setStats({
              streak:    logs.length,           // simplified — replace with real streak later
              avgMood:   avg.toFixed(1),
              totalDays: logs.length,
            });
          }
        } catch {

        } finally {
          if (active) setLoadingLog(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  const goToLog = () => {
    if (todayLog) {
      router.push(`/tabs/journal/${todayLog.id}?edit=true`);
    } else {
      router.push('/tabs/journal/new');
    }
  };

  const moodInfo = todayLog ? getMoodInfo(todayLog.mood) : null;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>


        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{getGreeting()}</Text>
            <Text style={s.username}>{displayName}</Text>
          </View>
          <TouchableOpacity
            style={s.avatar}
            onPress={() => router.push('/tabs/profile')}
          >
            <Text style={s.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>


        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryValue}>{stats.streak}</Text>
            <Text style={s.summaryLabel}>Ngày gần đây</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryValue}>{stats.avgMood}</Text>
            <Text style={s.summaryLabel}>Mood TB tuần</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryValue}>{stats.totalDays}</Text>
            <Text style={s.summaryLabel}>Ngày đã log</Text>
          </View>
        </View>


        <Text style={s.sectionTitle}>Hôm nay bạn thế nào?</Text>

        <TouchableOpacity style={[s.quickLogCard, cardShadow]} onPress={goToLog} activeOpacity={0.85}>
          {loadingLog ? (
            <ActivityIndicator color="#1BAABD" style={{ paddingVertical: 20 }} />
          ) : todayLog && moodInfo ? (

            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontSize: 48, marginBottom: 4 }}>{moodInfo.emoji}</Text>
              <Text style={s.quickLogTitle}>{moodInfo.name}</Text>
              {todayLog.note ? (
                <Text
                  numberOfLines={2}
                  style={{ fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#4A7A9B', textAlign: 'center', paddingHorizontal: 16 }}
                >
                  {todayLog.note}
                </Text>
              ) : null}
              <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#7FB3CC', marginTop: 6 }}>
                Nhấn để chỉnh sửa
              </Text>
            </View>
          ) : (

            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>~</Text>
              <Text style={s.quickLogTitle}>Chạm để ghi lại tâm trạng</Text>
              <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#9BB5C4' }}>
                Mood wheel + nhật ký + ảnh
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.logBtn} onPress={goToLog}>
          <Text style={s.logBtnText}>
            {todayLog ? 'Tiếp tục viết nhật ký' : 'Ghi nhật ký hôm nay'}
          </Text>
        </TouchableOpacity>


        <Text style={s.sectionTitle}>Thói quen hôm nay</Text>
        {HABITS.map((h, i) => (
          <TouchableOpacity key={i} style={s.habitCard} onPress={() => toggleHabit(i)}>
            <View style={s.habitLeft}>
              <Text style={s.habitEmoji}>{h.emoji}</Text>
              <View>
                <Text style={s.habitName}>{h.name}</Text>
                <Text style={s.habitSub}>{h.sub}</Text>
              </View>
            </View>
            <View style={[s.habitCheck, habits[i] && s.habitCheckDone]}>
              {habits[i] && <Text style={s.habitCheckText}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
