import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { psychPhaseStyles as s } from '../../styles/tracker.styles';

interface Props {
  avgScore: number;
}

function getPhase(score: number) {
  if (score >= 4.5) return {
    phase: 'Giai đoạn Thịnh vượng',
    emoji: '',
    desc: 'Bạn đang ở trạng thái tâm lý tốt nhất — năng lượng cao, tích cực và kết nối tốt với bản thân.',
    color: Colors.moodScale[10],
    quote: '"Hãy tận dụng năng lượng này để tạo ra những điều tuyệt vời. Bạn đang ở đỉnh cao của mình."',
  };
  if (score >= 3.5) return {
    phase: 'Giai đoạn Cân bằng',
    emoji: '',
    desc: 'Tâm lý ổn định, bạn đang duy trì trạng thái cân bằng tốt giữa cảm xúc và lý trí.',
    color: Colors.moodScale[7],
    quote: '"Sự bình yên không phải là vắng lặng hoàn toàn — mà là bình thản giữa sóng gió."',
  };
  if (score >= 2.5) return {
    phase: 'Giai đoạn Thích nghi',
    emoji: '',
    desc: 'Bạn đang đối mặt với một số thách thức. Đây là lúc cần quan tâm đến bản thân hơn.',
    color: Colors.moodScale[5],
    quote: '"Mỗi ngày khó khăn đều là bước đệm để bạn trưởng thành hơn. Hãy kiên nhẫn với bản thân."',
  };
  if (score >= 1.5) return {
    phase: 'Giai đoạn Phục hồi',
    emoji: '',
    desc: 'Tâm lý đang ở mức thấp. Hãy ưu tiên nghỉ ngơi và tìm kiếm sự hỗ trợ nếu cần.',
    color: Colors.moodScale[3],
    quote: '"Cảm thấy mệt mỏi không có nghĩa là yếu đuối. Nghỉ ngơi cũng là một dạng dũng cảm."',
  };
  return {
    phase: 'Giai đoạn Khủng hoảng',
    emoji: '',
    desc: 'Bạn đang trải qua giai đoạn rất khó khăn. Hãy liên hệ người thân hoặc chuyên gia tâm lý.',
    color: Colors.moodScale[1],
    quote: '"Trong bóng tối nhất, ngay cả ánh sáng nhỏ nhất cũng đủ để soi đường. Bạn không đơn độc."',
  };
}

export default function PsychPhaseCard({ avgScore }: Props) {
  const { phase, emoji, desc, color, quote } = getPhase(avgScore);

  return (
    <View>

      <View style={[s.phaseCard, { borderLeftColor: color }]}>
        <View style={s.phaseTop}>
          <Text style={s.phaseEmoji}>{emoji}</Text>
          <View style={s.phaseInfo}>
            <Text style={s.phaseLabel}>Nhận định tâm lý</Text>
            <Text style={s.phaseName}>{phase}</Text>
          </View>
          <View style={[s.scoreBadge, { backgroundColor: color + '30' }]}>
            <Text style={[s.scoreText, { color }]}>{avgScore.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={s.phaseDesc}>{desc}</Text>
      </View>


      <View style={s.quoteCard}>
        <Text style={s.quoteIcon}></Text>
        <Text style={s.quoteText}>{quote}</Text>
      </View>
    </View>
  );
}