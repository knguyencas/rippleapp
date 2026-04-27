import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, TouchableOpacity } from 'react-native';
import { heroProgressStyles as s } from '../../styles/tracker/tracker-redesign.styles';

interface Props {
  doneCount: number;
  totalCount: number;
  percent: number;
  animationKey: number;
  recommendation: string;
  ctaLabel: string;
  onCtaPress: () => void;
}

export default function HeroProgressCard({
  doneCount,
  totalCount,
  percent,
  animationKey,
  recommendation,
  ctaLabel,
  onCtaPress,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const [displayPct, setDisplayPct] = useState(0);
  const pctInt = Math.max(0, Math.min(100, Math.round(percent)));
  const firstHalfRotation = progress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['-135deg', '45deg', '45deg'],
    extrapolate: 'clamp',
  });
  const secondHalfRotation = progress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['-135deg', '-135deg', '45deg'],
    extrapolate: 'clamp',
  });
  const message =
    pctInt === 100
      ? `Hoàn thành tất cả\n${totalCount} việc hôm nay!`
      : `Đã xong ${doneCount}/${totalCount} việc\n${recommendation}`;

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      setDisplayPct(Math.max(0, Math.min(100, Math.round(value))));
    });

    return () => {
      progress.removeListener(id);
    };
  }, [progress]);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    setDisplayPct(0);

    Animated.timing(progress, {
      toValue: pctInt,
      duration: 780,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setDisplayPct(pctInt);
    });
  }, [animationKey, pctInt, progress]);

  return (
    <View style={s.card}>
      <View style={s.pctBlock}>
        <View style={s.pctTrack} />
        <View style={s.pctRightClip}>
          <Animated.View
            style={[
              s.pctProgressHalf,
              s.pctProgressRight,
              { transform: [{ rotate: firstHalfRotation }] },
            ]}
          />
        </View>
        <View style={s.pctLeftClip}>
          <Animated.View
            style={[
              s.pctProgressHalf,
              s.pctProgressLeft,
              { transform: [{ rotate: secondHalfRotation }] },
            ]}
          />
        </View>
        <View style={s.pctContent}>
          <Text style={s.pctText}>{displayPct}%</Text>
          <Text style={s.pctSub}>hoàn thành</Text>
        </View>
      </View>

      <View style={s.body}>
        <Text style={s.bodyText}>{message}</Text>
        <View style={s.bodyProgressTrack}>
          <View style={[s.bodyProgressFill, { width: `${pctInt}%` }]} />
        </View>
        <TouchableOpacity style={s.cta} onPress={onCtaPress} activeOpacity={0.85}>
          <Text style={s.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
