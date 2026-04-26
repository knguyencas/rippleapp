import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { commonStyles as c } from '../../../styles/shared/common.styles';
import { profileStyles as s } from '../../../styles/profile/profile.styles';
import { useAuthStore } from '../../../stores/auth.store';
import api from '../../../services/core/api';
import TimePickerModal from '../../../components/profile/TimePickerModal';
import {
  getReminderPref, enableReminder, disableReminder,
  formatTime, ReminderPref, DEFAULT_PREF,
} from '../../../services/profile/notification.service';

interface UserStats {
  streak: number;
  totalLogs: number;
  avgMood: number | null;
}

function resolveRowPress(label: string): (() => void) | undefined {
  switch (label) {
    case 'Chỉnh sửa hồ sơ':              return () => router.push('/tabs/profile/edit');
    case 'Bảo mật & Mật khẩu':           return () => router.push('/tabs/profile/security');
    case 'Thông báo':                    return () => Linking.openSettings().catch(() => {});
    case 'Ngôn ngữ':                     return () => router.push('/tabs/profile/language');
    case 'Trợ giúp & FAQ':               return () => router.push('/tabs/profile/help');
    case 'Gửi phản hồi':                 return () => router.push('/tabs/profile/feedback');
    case 'Điều khoản & Quyền riêng tư':  return () => router.push('/tabs/profile/terms');
    default: return undefined;
  }
}

const SECTION_ITEMS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: '', label: 'Chỉnh sửa hồ sơ',    arrow: true },
      { icon: '', label: 'Bảo mật & Mật khẩu',  arrow: true },
      { icon: '', label: 'Thông báo',             arrow: true },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { icon: '', label: 'Ngôn ngữ',                    arrow: true },
      { icon: '', label: 'Giao diện',                   arrow: true },
    ],
  },
  {
    title: 'Hỗ trợ',
    items: [
      { icon: '', label: 'Trợ giúp & FAQ',               arrow: true },
      { icon: '', label: 'Gửi phản hồi',                 arrow: true },
      { icon: '', label: 'Điều khoản & Quyền riêng tư', arrow: true },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [reminder, setReminder] = useState<ReminderPref>(DEFAULT_PREF);
  const [pickerVisible, setPickerVisible] = useState(false);

  const displayName = user?.displayName || user?.username || 'Người dùng';
  const initials = displayName.slice(0, 2).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const res = await api.get('/users/stats');
          setStats(res.data);
        } catch (e) {
          console.error('stats fetch failed:', e);
        }
        const p = await getReminderPref();
        setReminder(p);
      })();
    }, [])
  );

  const handleToggleReminder = (next: boolean) => {
    if (next) {
      setPickerVisible(true);
    } else {
      disableReminder().then(() => setReminder((r) => ({ ...r, enabled: false })));
    }
  };

  const handleConfirmTime = async (hour: number, minute: number) => {
    setPickerVisible(false);
    const ok = await enableReminder(hour, minute);
    if (ok) {
      setReminder({ enabled: true, hour, minute });
    } else {
      setReminder({ enabled: false, hour, minute });
      Alert.alert(
        'Cần quyền thông báo',
        'Ripple cần quyền gửi thông báo. Vui lòng bật trong cài đặt máy.',
        [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Mở cài đặt', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={c.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <Text style={s.headerTitle}>Hồ sơ</Text>
        </View>

        <View style={s.avatarCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>{displayName}</Text>
            <Text style={s.avatarSub}>@{user?.username}</Text>
            {user?.ageGroup && (
              <Text style={s.avatarAge}>Nhóm tuổi: {user.ageGroup}</Text>
            )}
          </View>
          <TouchableOpacity style={s.editBtn} onPress={() => router.push('/tabs/profile/edit')}>
            <Text style={s.editBtnText}>Sửa</Text>
          </TouchableOpacity>
        </View>


        <View style={s.streakCard}>
          <View style={s.streakLeft}>
            <Text style={s.streakFire}></Text>
            <View>
              <Text style={s.streakNum}>
                {stats != null ? `${stats.streak} ngày` : '—'}
              </Text>
              <Text style={s.streakLabel}>Streak hiện tại</Text>
            </View>
          </View>
          <View style={s.streakDivider} />
          <View style={s.streakRight}>
            <Text style={s.streakNum}>{stats != null ? stats.totalLogs : '—'}</Text>
            <Text style={s.streakLabel}>Tổng log</Text>
          </View>
          <View style={s.streakDivider} />
          <View style={s.streakRight}>
            <Text style={s.streakNum}>
              {stats?.avgMood != null ? stats.avgMood.toFixed(1) : '—'}
            </Text>
            <Text style={s.streakLabel}>Mood TB 30d</Text>
          </View>
        </View>

        <TouchableOpacity
          style={s.reminderCard}
          onPress={() => reminder.enabled && setPickerVisible(true)}
          activeOpacity={reminder.enabled ? 0.7 : 1}
        >
          <View style={s.reminderLeft}>
            <Text style={s.reminderIcon}></Text>
            <View>
              <Text style={s.reminderLabel}>Nhắc nhở hàng ngày</Text>
              <Text style={s.reminderSub}>
                {reminder.enabled
                  ? `Mỗi ngày lúc ${formatTime(reminder.hour, reminder.minute)} — chạm để đổi giờ`
                  : 'Nhắc bạn ghi journal mỗi ngày'}
              </Text>
            </View>
          </View>
          <Switch
            value={reminder.enabled}
            onValueChange={handleToggleReminder}
            trackColor={{ true: Colors.teal, false: Colors.border }}
            thumbColor={Colors.textLight}
          />
        </TouchableOpacity>

        <TimePickerModal
          visible={pickerVisible}
          initialHour={reminder.hour}
          initialMinute={reminder.minute}
          onClose={() => setPickerVisible(false)}
          onConfirm={handleConfirmTime}
        />

        {SECTION_ITEMS.map((section, si) => (
          <View key={si} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionCard}>
              {section.items.map((item, ii) => {
                const onPress = resolveRowPress(item.label);
                return (
                  <TouchableOpacity
                    key={ii}
                    style={[
                      s.settingRow,
                      ii < section.items.length - 1 && s.settingRowBorder,
                    ]}
                    onPress={onPress}
                    disabled={!onPress}
                  >
                    <Text style={s.settingIcon}>{item.icon}</Text>
                    <Text style={s.settingLabel}>{item.label}</Text>
                    {item.arrow && <Text style={s.settingArrow}>›</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}


        <View style={s.section}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutIcon}></Text>
            <Text style={s.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Ripple v1.0.0</Text>
        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
