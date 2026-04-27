import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../stores/auth.store';
import api from '../../../services/core/api';
import MoodWheel, { MOODS } from '../../../components/mood/MoodWheel';
import HomeHeader from '../../../components/home/HomeHeader';
import StatsRow from '../../../components/home/StatsRow';
import MoodInputCard from '../../../components/home/MoodInputCard';
import QuickActionsGrid from '../../../components/home/QuickActionsGrid';
import PrimaryCTA from '../../../components/home/PrimaryCTA';
import SoraPromoCard from '../../../components/home/SoraPromoCard';
import { homeScreenStyles as s } from '../../../styles/home/home-screen.styles';
import { calculateAverageMood, getMoodInfoByName } from '../../../utils/home/home.utils';
import { fetchNotifications } from '../../../services/profile/notifications.service';

interface TodayLog {
  id: string;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

export default function HomeScreen() {
  const streak = useAuthStore((s) => s.streak);
  const pingStreak = useAuthStore((s) => s.pingStreak);

  const [todayLog, setTodayLog] = useState<TodayLog | null>(null);
  const [avgMood, setAvgMood] = useState<string>('—');
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [hasNotification, setHasNotification] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          await pingStreak();
          const [todayRes, logs7Res, statsRes] = await Promise.all([
            api.get('/logs/today'),
            api.get('/logs?limit=7'),
            api.get('/logs/stats'),
          ]);

          if (!active) return;

          setTodayLog(todayRes.data?.log ?? null);
          setAvgMood(calculateAverageMood(logs7Res.data ?? []));
          setTotalLogs(Number(statsRes.data?.totalLogs ?? 0));
        } catch {
        }

        try {
          const notifications = await fetchNotifications(1);
          if (active) setHasNotification(notifications.unreadCount > 0);
        } catch {
          if (active) setHasNotification(false);
        }
      })();
      return () => { active = false; };
    }, [pingStreak])
  );

  const handleMoodConfirm = async (mood: typeof MOODS[0]) => {
    setShowWheel(false);
    try {
      if (todayLog) {
        await api.put(`/logs/${todayLog.id}`, {
          mood: mood.name,
          moodScore: mood.score,
        });
        setTodayLog({ ...todayLog, mood: mood.name, moodScore: mood.score });
      } else {
        const res = await api.post('/logs', {
          mood: mood.name,
          moodScore: mood.score,
          factors: [],
          note: null,
        });
        setTodayLog(res.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const existingId = error.response.data?.existingId;
        if (existingId) {
          try {
            await api.put(`/logs/${existingId}`, {
              mood: mood.name,
              moodScore: mood.score,
            });
            setTodayLog((prev) =>
              prev ? { ...prev, mood: mood.name, moodScore: mood.score } : null
            );
          } catch {
            Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
          }
        }
      } else {
        Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
      }
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
  const moodLabel = moodInfo?.name ?? null;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader hasNotification={hasNotification} />

        <StatsRow
          streak={streak}
          avgMood7d={avgMood}
          totalLogs={totalLogs}
          onPressStreak={() => router.push('/tabs/tracker?focus=calendar')}
          onPressAvgMood={() => router.push('/tabs/tracker?focus=chart')}
          onPressTotalLogs={() => router.push('/tabs/journal')}
        />

        <MoodInputCard
          loggedToday={!!todayLog}
          todayMoodLabel={moodLabel}
          todayNote={todayLog?.note ?? null}
          onPress={() => setShowWheel(true)}
        />

        <View style={s.sectionRow}>
          <Text style={s.sectionRowTitle}>Cập nhật nhanh hôm nay</Text>
        </View>

        <QuickActionsGrid />

        <PrimaryCTA
          label={todayLog ? 'Tiếp tục viết nhật ký' : 'Ghi nhật ký hôm nay'}
          onPress={goToJournal}
        />

        <SoraPromoCard />
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
