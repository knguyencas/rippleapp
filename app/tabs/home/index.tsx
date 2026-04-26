import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeStyles as s, homeQuickLogShadow } from '../../../styles/home/home.styles';
import { useAuthStore } from '../../../stores/auth.store';
import MoodWheel, { MOODS } from '../../../components/mood/MoodWheel';
import api from '../../../services/core/api';
import { calculateAverageMood, getMoodInfoByName } from '../../../utils/home/home.utils';

interface TodayLog {
  id: string;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const streak = useAuthStore((s) => s.streak);
  const pingStreak = useAuthStore((s) => s.pingStreak);

  const [todayLog, setTodayLog]     = useState<TodayLog | null>(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const [avgMood, setAvgMood]       = useState<string>('-');
  const [totalLogs, setTotalLogs]   = useState<number>(0);
  const [showWheel, setShowWheel]   = useState(false);
  const [savingMood, setSavingMood] = useState(false);

  const displayName = user?.displayName || user?.username || 'bạn';
  const initials    = displayName.slice(0, 2).toUpperCase();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      pingStreak();
      (async () => {
        setLoadingLog(true);
        try {
          const [todayRes, logs7Res, statsRes] = await Promise.all([
            api.get('/logs/today'),
            api.get('/logs?limit=7'),
            api.get('/logs/stats'),
          ]);

          if (!active) return;

          setTodayLog(todayRes.data?.log ?? null);

          const logs7: TodayLog[] = logs7Res.data ?? [];
          setAvgMood(calculateAverageMood(logs7));

          setTotalLogs(Number(statsRes.data?.totalLogs ?? 0));
        } catch {
        } finally {
          if (active) setLoadingLog(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  const handleMoodConfirm = async (mood: typeof MOODS[0]) => {
    setShowWheel(false);
    setSavingMood(true);
    try {
      if (todayLog) {
        await api.put(`/logs/${todayLog.id}`, {
          mood:      mood.name,
          moodScore: mood.score,
        });
        setTodayLog({ ...todayLog, mood: mood.name, moodScore: mood.score });
      } else {
        const res = await api.post('/logs', {
          mood:      mood.name,
          moodScore: mood.score,
          factors:   [],
          note:      null,
        });
        setTodayLog(res.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const existingId = error.response.data?.existingId;
        if (existingId) {
          try {
            await api.put(`/logs/${existingId}`, {
              mood:      mood.name,
              moodScore: mood.score,
            });
            setTodayLog(prev => prev ? { ...prev, mood: mood.name, moodScore: mood.score } : null);
          } catch {
            Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
          }
        }
      } else {
        Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
      }
    } finally {
      setSavingMood(false);
    }
  };

  const goToJournal = () => {
    if (todayLog) {
      router.push(`/tabs/journal/${todayLog.id}?edit=true`);
    } else {
      router.push('/tabs/journal/new');
    }
  };

  const moodInfo = todayLog ? getMoodInfoByName(MOODS, todayLog.mood) : null;

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
            <Text style={s.summaryValue}>{streak}</Text>
            <Text style={s.summaryLabel}>Chuỗi ngày</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryValue}>{avgMood}</Text>
            <Text style={s.summaryLabel}>Mood TB 7 ngày</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryValue}>{totalLogs}</Text>
            <Text style={s.summaryLabel}>Log đã ghi</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Hôm nay bạn thế nào?</Text>

        <TouchableOpacity
          style={[s.quickLogCard, homeQuickLogShadow]}
          onPress={() => setShowWheel(true)}
          activeOpacity={0.85}
        >
          {loadingLog || savingMood ? (
            <ActivityIndicator color="#1BAABD" style={s.quickLogLoading} />
          ) : todayLog && moodInfo ? (
            <View style={s.quickLogInner}>
              <Text style={s.quickLogEmoji}>{moodInfo.emoji}</Text>
              <Text style={s.quickLogTitle}>{moodInfo.name}</Text>
              {todayLog.note ? (
                <Text
                  numberOfLines={2}
                  style={s.quickLogNote}
                >
                  {todayLog.note}
                </Text>
              ) : null}
              <Text style={s.quickLogHint}>
                Nhấn để thay đổi tâm trạng
              </Text>
            </View>
          ) : (
            <View style={s.quickLogEmptyInner}>
              <Text style={s.quickLogEmptyEmoji}>~</Text>
              <Text style={s.quickLogTitle}>Chạm để ghi lại tâm trạng</Text>
              <Text style={s.quickLogEmptyHint}>
                Chọn mood bằng emotion wheel
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.logBtn} onPress={goToJournal}>
          <Text style={s.logBtnText}>
            {todayLog ? 'Tiếp tục viết nhật ký' : 'Ghi nhật ký hôm nay'}
          </Text>
        </TouchableOpacity>

        <View style={s.bottomSpacer} />
      </ScrollView>

      {showWheel && (
        <MoodWheel
          onConfirm={handleMoodConfirm}
          onClose={() => setShowWheel(false)}
        />
      )}
    </SafeAreaView>
  );
}
