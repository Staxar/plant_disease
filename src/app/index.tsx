import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePickerComponent from '../../components/ImagePicker';

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Plant disease</Text>
        <ImagePickerComponent />
        <View>
          <Text>Your plant is: </Text>
        </View>
        <Link href={{ pathname: '_sitemap' }}>Go to sitemap</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  main: {
    flex: 1,
    maxWidth: 960,
    marginHorizontal: 'auto',
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 58,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
  innerContainer: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderRadius: 8,
  },
});
