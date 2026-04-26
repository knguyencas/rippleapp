import { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  PanResponder, Platform,
  GestureResponderEvent, Modal
} from 'react-native';
import {
  moodWheelStyles as s,
  wheelStyles as ls,
  moodWheelElementStyles as es,
  MOOD_WHEEL_SIZE,
  MOOD_WHEEL_RADIUS,
  MOOD_WHEEL_INNER_RADIUS,
} from '../../styles/mood/mood-wheel.styles';
import { Colors } from '../../constants/colors';
import {
  buildEmojiPositions,
  getSnappedDegree,
  getWheelIndexFromDegree,
} from '../../utils/mood/mood-wheel.utils';

export const MOODS = [
  { emoji: '😶‍🌫️', name: 'Tê liệt',    desc: 'Mất cảm xúc, không còn cảm nhận', score: 1, color: Colors.moodScale[0] },
  { emoji: '😶',    name: 'Mơ hồ',     desc: 'Cảm giác trống rỗng, mơ hồ',      score: 1, color: Colors.moodScale[1] },
  { emoji: '😢',    name: 'Buồn bã',   desc: 'Nặng nề, khó chịu trong lòng',    score: 2, color: Colors.moodScale[2] },
  { emoji: '😔',    name: 'Mệt mỏi',   desc: 'Kiệt sức, thiếu năng lượng',      score: 2, color: Colors.moodScale[3] },
  { emoji: '😤',    name: 'Cáu kỉnh',  desc: 'Dễ bực bội, mất kiên nhẫn',      score: 2, color: Colors.moodScale[4] },
  { emoji: '😐',    name: 'Thờ ơ',     desc: 'Không cảm thấy gì đặc biệt',     score: 3, color: Colors.moodScale[5] },
  { emoji: '😌',    name: 'Bình tĩnh', desc: 'Ổn định, cân bằng trong lòng',    score: 3, color: Colors.moodScale[6] },
  { emoji: '🙂',    name: 'Ổn',        desc: 'Cảm thấy tương đối tốt',          score: 4, color: Colors.moodScale[7] },
  { emoji: '😊',    name: 'Tích cực',  desc: 'Nhẹ nhàng, có năng lượng',        score: 4, color: Colors.moodScale[8] },
  { emoji: '😄',    name: 'Vui vẻ',    desc: 'Cảm thấy tốt, hứng khởi',        score: 5, color: Colors.moodScale[9] },
  { emoji: '🤩',    name: 'Phấn khởi', desc: 'Tràn đầy năng lượng và niềm vui', score: 5, color: Colors.moodScale[10] },
];

const N            = MOODS.length;
const TRACK_R      = (MOOD_WHEEL_RADIUS * 0.72 + MOOD_WHEEL_INNER_RADIUS) / 2 + MOOD_WHEEL_INNER_RADIUS * 0.3;
const ITEM_SIZE    = 40;
const DEG_PER_ITEM = 360 / N;
const INITIAL_IDX  = 5;

function makeWheelSVG(size: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const R  = size / 2 - 1;
  const r  = MOOD_WHEEL_INNER_RADIUS;

  const paths = MOODS.map((mood, i) => {
    const a1  = ((i * DEG_PER_ITEM) - 90) * Math.PI / 180;
    const a2  = (((i + 1) * DEG_PER_ITEM) - 90) * Math.PI / 180;
    const ox1 = cx + R * Math.cos(a1);
    const oy1 = cy + R * Math.sin(a1);
    const ox2 = cx + R * Math.cos(a2);
    const oy2 = cy + R * Math.sin(a2);
    const ix2 = cx + r * Math.cos(a2);
    const iy2 = cy + r * Math.sin(a2);
    const ix1 = cx + r * Math.cos(a1);
    const iy1 = cy + r * Math.sin(a1);
    const d   = [
      `M${ox1.toFixed(2)},${oy1.toFixed(2)}`,
      `A${R},${R} 0 0,1 ${ox2.toFixed(2)},${oy2.toFixed(2)}`,
      `L${ix2.toFixed(2)},${iy2.toFixed(2)}`,
      `A${r},${r} 0 0,0 ${ix1.toFixed(2)},${iy1.toFixed(2)}`,
      'Z',
    ].join(' ');
    return `<path d="${d}" fill="${mood.color}" stroke="white" stroke-width="1.5"/>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${paths.join('')}</svg>`;
}

const SVG_HTML = makeWheelSVG(MOOD_WHEEL_SIZE);
const SVG_URI  = `data:image/svg+xml;utf8,${encodeURIComponent(SVG_HTML)}`;

function WheelBackground() {
  if (Platform.OS === 'web') {
    const Div = 'div' as any;
    return (
      <Div
        style={es.wheelBackground}
        dangerouslySetInnerHTML={{ __html: SVG_HTML }}
      />
    );
  }
  const ImgTag = 'img' as any;
  return (
    <ImgTag
      src={SVG_URI}
      style={es.wheelBackground}
    />
  );
}

interface Props {
  onConfirm: (mood: typeof MOODS[0]) => void;
  onClose:   () => void;
}

export default function MoodWheel({ onConfirm, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(INITIAL_IDX);

  const initDeg      = -((INITIAL_IDX + 0.5) * DEG_PER_ITEM);
  const slideAnim    = useRef(new Animated.Value(400)).current;
  const wheelRotation = useRef(new Animated.Value(initDeg)).current;
  const currentDeg   = useRef(initDeg);
  const lastX        = useRef(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0, tension: 60, friction: 12, useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const rotateDeg = useMemo(() =>
    wheelRotation.interpolate({
      inputRange:  [-10000, 10000],
      outputRange: ['-10000deg', '10000deg'],
    }), []);

  const negRotateDeg = useMemo(() =>
    wheelRotation.interpolate({
      inputRange:  [-10000, 10000],
      outputRange: ['10000deg', '-10000deg'],
    }), []);

  const emojiPositions = useMemo(
    () => buildEmojiPositions(N, DEG_PER_ITEM, MOOD_WHEEL_RADIUS, TRACK_R, ITEM_SIZE),
    []
  );

  const snapToIdx = (idx: number) => {
    const snapped = getSnappedDegree(currentDeg.current, idx, DEG_PER_ITEM);
    currentDeg.current = snapped;
    Animated.spring(wheelRotation, {
      toValue: snapped, tension: 80, friction: 10, useNativeDriver: Platform.OS !== 'web',
    }).start();
    setCurrentIdx(idx);
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e: GestureResponderEvent) => {
      lastX.current = e.nativeEvent.pageX;
    },
    onPanResponderMove: (e: GestureResponderEvent) => {
      const dx = e.nativeEvent.pageX - lastX.current;
      lastX.current = e.nativeEvent.pageX;
      currentDeg.current += dx * 0.4;
      wheelRotation.setValue(currentDeg.current);
      setCurrentIdx(getWheelIndexFromDegree(currentDeg.current, DEG_PER_ITEM, N));
    },
    onPanResponderRelease: () => snapToIdx(currentIdx),
  }), [currentIdx]);

  const handleConfirm = () => {
    Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: false })
      .start(() => onConfirm(MOODS[currentIdx]));
  };

  const handleClose = () => {
    Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: false })
      .start(onClose);
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity activeOpacity={1} style={es.sheetBody}>

            <View style={s.handle} />
            <Text style={s.moodEmojiBig}>{MOODS[currentIdx].emoji}</Text>
            <Text style={s.moodName}>{MOODS[currentIdx].name}</Text>
            <Text style={s.moodDesc}>{MOODS[currentIdx].desc}</Text>

            <View style={ls.wheelClip} {...panResponder.panHandlers}>
              <Animated.View style={[ls.wheelInner, { transform: [{ rotate: rotateDeg }] }]}>

                <WheelBackground />

                {MOODS.map((mood, i) => {
                  const { left, top } = emojiPositions[i];
                  const isActive   = i === currentIdx;
                  const dist       = Math.min(
                    Math.abs(i - currentIdx),
                    N - Math.abs(i - currentIdx)
                  );
                  const opacity = isActive ? 1 : Math.max(0.45, 1 - dist * 0.12);

                  return (
                    <Animated.View
                      key={i}
                      style={[
                        es.emojiItemBase,
                        {
                          left,
                          top,
                          width: ITEM_SIZE,
                          height: ITEM_SIZE,
                          opacity,
                          transform: [
                            { rotate: negRotateDeg },
                            { scale: isActive ? 1.25 : 0.85 },
                          ],
                        },
                      ]}
                    >
                      <Text style={[es.emojiText, isActive && es.emojiTextActive]}>
                        {mood.emoji}
                      </Text>
                    </Animated.View>
                  );
                })}

                <View style={ls.centerHole} />
              </Animated.View>

              <View style={ls.needleWrap} pointerEvents="none">
                <View style={ls.needleLine} />
                <View style={ls.needleTip} />
                <View style={ls.needleCenter} />
              </View>
            </View>

            <Text style={s.hint}>← Kéo để chọn tâm trạng →</Text>

            <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
              <Text style={s.confirmBtnText}>Xác nhận</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.skipBtn} onPress={handleClose}>
              <Text style={s.skipText}>Bỏ qua hôm nay</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
