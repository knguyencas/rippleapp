import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  meditationModalStyles as s,
  meditationAwayDialogStyles as d,
} from '../../styles/tracker/meditation-modal.styles';
import {
  fetchSounds,
  createSession,
  type MeditationSound,
} from '../../services/tracker/meditation.service';
import {
  isDownloaded,
  downloadSound,
  getLocalUri,
} from '../../services/tracker/meditation-download.service';
import { useMeditationSession } from '../../hooks/tracker/useMeditationSession';
import {
  DURATION_OPTIONS,
  DEFAULT_DURATION,
  type DurationMin,
} from '../../constants/tracker/meditation.constants';
import {
  formatCountdown,
  formatFileSize,
} from '../../utils/tracker/meditation.utils';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSessionSaved?: (actualMin: number) => void;
}

const SOUND_IDS = ['rain', 'ocean', 'forest', 'white_noise', 'ambient_pad', 'bowl'];

export default function MeditationModal({ visible, onClose, onSessionSaved }: Props) {
  const [sounds, setSounds] = useState<MeditationSound[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [downloadedSet, setDownloadedSet] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [selectedSoundId, setSelectedSoundId] = useState<string | null>(null);
  const [duration, setDuration] = useState<DurationMin>(DEFAULT_DURATION);
  const [savingSession, setSavingSession] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);

  const { state: session, start, pause, resume, stopAndSave, cancel, dismissAwayDialog } =
    useMeditationSession(async (actualMin) => {
      await persistSession(actualMin);
    });

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      setLoadingCatalog(true);
      try {
        const [list, downloaded] = await Promise.all([
          fetchSounds(),
          (async () => {
            const out = new Set<string>();
            for (const id of SOUND_IDS) {
              if (await isDownloaded(id)) out.add(id);
            }
            return out;
          })(),
        ]);
        if (cancelled) return;
        setSounds(list);
        setDownloadedSet(downloaded);
        const firstDownloaded = list.find((sd) => downloaded.has(sd.id));
        setSelectedSoundId((firstDownloaded ?? list[0])?.id ?? null);
      } catch (e) {
        console.warn('Load meditation catalog failed:', e);
      } finally {
        if (!cancelled) setLoadingCatalog(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visible]);

  const handleDownload = useCallback(
    async (sound: MeditationSound) => {
      if (downloadingId) return;
      setDownloadingId(sound.id);
      setDownloadProgress(0);
      try {
        await downloadSound(sound.id, sound.url, (ratio) => setDownloadProgress(ratio));
        setDownloadedSet((prev) => new Set(prev).add(sound.id));
        setSelectedSoundId(sound.id);
      } catch (e) {
        Alert.alert('Tải xuống thất bại', 'Vui lòng kiểm tra kết nối và thử lại.');
        console.warn('Download failed:', e);
      } finally {
        setDownloadingId(null);
        setDownloadProgress(0);
      }
    },
    [downloadingId]
  );

  const persistSession = useCallback(
    async (actualMin: number) => {
      if (!selectedSoundId || !sessionStartedAt) return;
      if (actualMin < 1) return;

      setSavingSession(true);
      try {
        await createSession({
          soundId: selectedSoundId,
          targetMin: duration,
          actualMin,
          startedAt: sessionStartedAt.toISOString(),
          completedAt: new Date().toISOString(),
        });
        onSessionSaved?.(actualMin);
      } catch (e) {
        Alert.alert('Lưu thất bại', 'Phiên thiền chưa được lưu lên server. Vui lòng thử lại.');
        console.warn('Save session failed:', e);
      } finally {
        setSavingSession(false);
      }
    },
    [selectedSoundId, duration, sessionStartedAt, onSessionSaved]
  );

  const handleStart = useCallback(async () => {
    if (!selectedSoundId) return;
    if (!downloadedSet.has(selectedSoundId)) {
      const sound = sounds.find((sd) => sd.id === selectedSoundId);
      if (sound) await handleDownload(sound);
      return;
    }
    const uri = getLocalUri(selectedSoundId);
    setSessionStartedAt(new Date());
    await start({ audioUri: uri, targetMin: duration });
  }, [selectedSoundId, downloadedSet, sounds, duration, start, handleDownload]);

  const handleStopAndSave = useCallback(async () => {
    const actualMin = await stopAndSave();
    if (actualMin >= 1) {
      await persistSession(actualMin);
    }
    setSessionStartedAt(null);
  }, [stopAndSave, persistSession]);

  const handleClose = useCallback(() => {
    if (session.status === 'idle' || session.status === 'completed') {
      onClose();
      return;
    }
    Alert.alert(
      'Kết thúc phiên thiền?',
      `Bạn đã thiền được ${Math.floor(session.elapsedSec / 60)} phút.`,
      [
        { text: 'Tiếp tục thiền', style: 'cancel', onPress: () => session.status === 'paused' && void resume() },
        {
          text: 'Lưu và đóng',
          onPress: async () => {
            await handleStopAndSave();
            onClose();
          },
        },
        {
          text: 'Bỏ',
          style: 'destructive',
          onPress: async () => {
            await cancel();
            setSessionStartedAt(null);
            onClose();
          },
        },
      ]
    );
  }, [session.status, session.elapsedSec, resume, handleStopAndSave, cancel, onClose]);

  const inSession = session.status === 'playing' || session.status === 'paused';
  const remainingSec = Math.max(0, session.targetSec - session.elapsedSec);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.headerRow}>
            <Text style={s.title}>Thiền</Text>
            <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
              <Text style={s.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.subtitle}>Hít thở chậm rãi, thư giãn cơ thể.</Text>

          {!inSession && session.status !== 'completed' && (
            <>
              <Text style={s.sectionLabel}>Chọn âm thanh</Text>
              {loadingCatalog ? (
                <ActivityIndicator style={{ marginVertical: 16 }} />
              ) : sounds.length === 0 ? (
                <Text style={s.emptyText}>Chưa có nhạc thiền. Vui lòng thử lại sau.</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.soundsScroll}
                >
                  {sounds.map((sd) => {
                    const isActive = sd.id === selectedSoundId;
                    const isDl = downloadedSet.has(sd.id);
                    const isCurrentlyDownloading = downloadingId === sd.id;

                    return (
                      <TouchableOpacity
                        key={sd.id}
                        style={[s.soundCard, isActive && s.soundCardActive]}
                        onPress={() => setSelectedSoundId(sd.id)}
                        activeOpacity={0.8}
                        disabled={isCurrentlyDownloading}
                      >
                        <Text style={s.soundName} numberOfLines={1}>{sd.name}</Text>
                        <Text style={s.soundDesc} numberOfLines={2}>{sd.description}</Text>

                        {isCurrentlyDownloading ? (
                          <View style={s.soundProgressBar}>
                            <View
                              style={[s.soundProgressFill, { width: `${Math.round(downloadProgress * 100)}%` }]}
                            />
                          </View>
                        ) : isDl ? (
                          <View style={s.soundStatus}>
                            <Text style={s.soundStatusText}>Đã tải</Text>
                          </View>
                        ) : (
                          <View style={[s.soundStatus, s.soundStatusInactive]}>
                            <Text style={[s.soundStatusText, s.soundStatusInactiveText]}>
                              Tải xuống · {formatFileSize(sd.fileSizeMB)}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <Text style={s.sectionLabel}>Thời lượng</Text>
              <View style={s.durationRow}>
                {DURATION_OPTIONS.map((minute) => {
                  const active = duration === minute;
                  return (
                    <TouchableOpacity
                      key={minute}
                      style={[s.durationChip, active && s.durationChipActive]}
                      onPress={() => setDuration(minute)}
                    >
                      <Text style={[s.durationChipText, active && s.durationChipTextActive]}>
                        {minute} phút
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {(inSession || session.status === 'completed') && (
            <View style={s.hero}>
              <Text style={s.heroCountdown}>{formatCountdown(remainingSec)}</Text>
              <Text style={s.heroSub}>
                {session.status === 'completed'
                  ? `Đã thiền ${Math.round(session.targetSec / 60)} phút`
                  : session.status === 'paused'
                    ? `Đang tạm dừng — ${Math.floor(session.elapsedSec / 60)} phút đã trôi qua`
                    : `Còn lại / ${duration} phút`}
              </Text>
            </View>
          )}

          <View style={s.actions}>
            {session.status === 'idle' && (
              <TouchableOpacity
                style={[
                  s.primaryBtn,
                  (!selectedSoundId || loadingCatalog) && s.primaryBtnDisabled,
                ]}
                onPress={handleStart}
                disabled={!selectedSoundId || loadingCatalog || downloadingId != null}
              >
                <Text style={s.primaryBtnText}>
                  {selectedSoundId && !downloadedSet.has(selectedSoundId)
                    ? `Tải xuống & bắt đầu`
                    : 'Bắt đầu thiền'}
                </Text>
              </TouchableOpacity>
            )}

            {session.status === 'playing' && (
              <TouchableOpacity style={s.primaryBtn} onPress={() => void pause('user')}>
                <Text style={s.primaryBtnText}>Tạm dừng</Text>
              </TouchableOpacity>
            )}

            {session.status === 'paused' && (
              <>
                <TouchableOpacity style={s.primaryBtn} onPress={() => void resume()}>
                  <Text style={s.primaryBtnText}>Tiếp tục</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.secondaryBtn} onPress={handleStopAndSave}>
                  <Text style={s.secondaryBtnText}>Kết thúc & lưu</Text>
                </TouchableOpacity>
              </>
            )}

            {session.status === 'completed' && (
              <TouchableOpacity
                style={s.primaryBtn}
                onPress={() => { setSessionStartedAt(null); onClose(); }}
                disabled={savingSession}
              >
                {savingSession
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={s.primaryBtnText}>Hoàn tất</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {session.showAwayDialog && (
          <View style={d.backdrop} pointerEvents="auto">
            <View style={d.card}>
              <Text style={d.title}>Phiên thiền đã tạm dừng</Text>
              <Text style={d.body}>
                Bạn đã rời app{' '}
                <Text style={d.bodyBold}>{session.awayDurationSec} giây</Text>
                . Đã thiền:{' '}
                <Text style={d.bodyBold}>
                  {Math.floor(session.elapsedSec / 60)} phút {session.elapsedSec % 60} giây
                </Text>
                .
              </Text>
              <View style={d.actions}>
                <TouchableOpacity
                  style={d.endBtn}
                  onPress={async () => {
                    dismissAwayDialog();
                    await handleStopAndSave();
                  }}
                >
                  <Text style={d.endText}>Kết thúc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={d.resumeBtn}
                  onPress={() => { dismissAwayDialog(); void resume(); }}
                >
                  <Text style={d.resumeText}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
