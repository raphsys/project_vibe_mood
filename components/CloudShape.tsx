import Svg, { Ellipse, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

interface CloudShapeProps {
  color: string;
  size?: number;
}

export function CloudShape({ color, size = 200 }: CloudShapeProps) {
  const scale = useSharedValue(1);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Svg width={size} height={size * 0.6} viewBox="0 0 200 120">
      <AnimatedG animatedProps={animatedProps}>
        <Ellipse cx="100" cy="80" rx="60" ry="40" fill={color} opacity={0.9} />
        <Ellipse cx="70" cy="70" rx="50" ry="35" fill={color} opacity={0.85} />
        <Ellipse cx="130" cy="70" rx="50" ry="35" fill={color} opacity={0.85} />
        <Ellipse cx="100" cy="60" rx="45" ry="30" fill={color} opacity={0.95} />
      </AnimatedG>
    </Svg>
  );
}
