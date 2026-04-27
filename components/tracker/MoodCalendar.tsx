import { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity,
  LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOODS } from '../mood/MoodWheel';
import { moodCalendarStyles as s } from '../../styles/tracker/tracker.styles';
import { toDateKey } from '../../utils/shared/date.utils';
import { getMoodEmojiByName } from '../../utils/shared/mood.utils';

export interface LogItem {
  id: string;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

interface Props {
  logsByDate: Record<string, LogItem[]>;
}

const WEEKDAYS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function monthTitle(d: Date): string {
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
}

function emojiFor(moodName: string): string | undefined {
  return getMoodEmojiByName(MOODS, moodName) || undefined;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

interface ActivityCard {
  key: string;
  logId: string;
  kind: 'log' | 'vote';
  title: string;
  subtitle: string;
  emoji?: string;
}

function buildActivityCards(logs: LogItem[]): ActivityCard[] {
  const cards: ActivityCard[] = [];
  for (const log of logs) {
    const emoji = emojiFor(log.mood);
    const time = formatTime(log.createdAt);
    const hasNote = !!log.note?.trim();

    if (hasNote) {
      cards.push({
        key: `${log.id}-log`,
        logId: log.id,
        kind: 'log',
        title: 'Đã ghi nhật ký',
        subtitle: log.note!.slice(0, 60) + (log.note!.length > 60 ? '…' : ''),
      });
    }
    cards.push({
      key: `${log.id}-vote`,
      logId: log.id,
      kind: 'vote',
      title: 'Đã vote cảm xúc',
      subtitle: `${log.mood} · ${time}`,
      emoji,
    });
  }
  return cards;
}

export default function MoodCalendar({ logsByDate }: Props) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { weeks, monthLabel, todayKey, loggedCountInMonth, monthDaysTotal } = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const gridStart = new Date(monthStart);
    const startOffset = (gridStart.getDay() + 6) % 7;
    gridStart.setDate(gridStart.getDate() - startOffset);

    const gridEnd = new Date(monthEnd);
    const endOffset = (6 - ((gridEnd.getDay() + 6) % 7));
    gridEnd.setDate(gridEnd.getDate() + endOffset);

    const totalDays = Math.round((gridEnd.getTime() - gridStart.getTime()) / 86400000) + 1;
    const numWeeks = Math.ceil(totalDays / 7);

    const weeksArr: Date[][] = [];
    const cursor = new Date(gridStart);
    for (let w = 0; w < numWeeks; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      weeksArr.push(week);
    }

    let logged = 0;
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      const k = toDateKey(new Date(today.getFullYear(), today.getMonth(), d));
      if (logsByDate[k]?.length) logged++;
    }

    return {
      weeks: weeksArr,
      monthLabel: monthTitle(today),
      todayKey: toDateKey(today),
      loggedCountInMonth: logged,
      monthDaysTotal: monthEnd.getDate(),
    };
  }, [today, logsByDate]);

  const selectedLogs = selectedKey ? (logsByDate[selectedKey] ?? []) : [];
  const activityCards = useMemo(
    () => buildActivityCards(selectedLogs),
    [selectedLogs]
  );

  const handleDayPress = (key: string, inMonth: boolean, isFuture: boolean) => {
    if (!inMonth || isFuture) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedKey(prev => (prev === key ? null : key));
  };

  const handleCardPress = (logId: string) => {
    router.push(`/tabs/journal/${logId}`);
  };

  const formatSelectedDate = (key: string) => {
    const d = new Date(key);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <View style={s.section}>
      <View style={s.header}>
        <Text style={s.title}>{monthLabel}</Text>
        <Text style={s.countBadge}>{loggedCountInMonth}/{monthDaysTotal} ngày</Text>
      </View>

      <View style={s.card}>
        <View style={s.weekdayRow}>
          {WEEKDAYS_VI.map(w => (
            <View key={w} style={s.weekdayCell}>
              <Text style={s.weekdayText}>{w}</Text>
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={s.weekRow}>
            {week.map(date => {
              const k = toDateKey(date);
              const inMonth = date.getMonth() === today.getMonth();
              const isFuture = date > today;
              const logged = inMonth && !isFuture && !!logsByDate[k]?.length;
              const isToday = k === todayKey;
              const isSelected = k === selectedKey;

              return (
                <TouchableOpacity
                  key={k}
                  activeOpacity={inMonth && !isFuture ? 0.7 : 1}
                  onPress={() => handleDayPress(k, inMonth, isFuture)}
                  style={[
                    s.dayCell,
                    !inMonth && s.dayCellOutOfMonth,
                    inMonth && isFuture && s.dayCellFuture,
                  ]}
                >
                  <View
                    style={[
                      s.dayCircle,
                      logged && !isToday && !isSelected && s.dayCellLogged,
                      isSelected && !isToday && s.dayCellSelected,
                      isToday && s.dayCellToday,
                    ]}
                  >
                    <Text
                      style={[
                        s.dayNumber,
                        logged && !isToday && !isSelected && s.dayNumberLogged,
                        isSelected && !isToday && s.dayNumberSelected,
                        isToday && s.dayNumberToday,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    {logged && !isToday && (
                      <View style={[s.loggedDot, isSelected && s.loggedDotSelected]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {selectedKey && (
          <View style={s.activityPanel}>
            <Text style={s.activityTitle}>
              {formatSelectedDate(selectedKey)}
            </Text>

            {activityCards.length === 0 ? (
              <Text style={s.activityEmpty}>Chưa có hoạt động ngày này.</Text>
            ) : (
              activityCards.map(card => (
                <TouchableOpacity
                  key={card.key}
                  style={s.activityCard}
                  onPress={() => handleCardPress(card.logId)}
                  activeOpacity={0.8}
                >
                  {card.kind === 'vote' && card.emoji ? (
                    <Text style={s.activityEmoji}>{card.emoji}</Text>
                  ) : (
                    <View style={s.activityIconWrap}>
                      <Text style={s.activityIcon}>
                        {card.kind === 'log' ? '✎' : '♥'}
                      </Text>
                    </View>
                  )}
                  <View style={s.activityBody}>
                    <Text style={s.activityLabel}>{card.title}</Text>
                    <Text style={s.activitySub} numberOfLines={1}>
                      {card.subtitle}
                    </Text>
                  </View>
                  <Text style={s.activityChevron}>›</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  );
}
