import * as tf from '@tensorflow/tfjs';
import * as tfrn from '@tensorflow/tfjs-react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePickerComponent from '../../components/ImagePicker';

export default function Page() {
  const [userImage, setUserImage] = useState();

  useEffect(() => {
    async function initializeTF() {
      await tf.ready();
    }

    initializeTF();
  }, []);

  async function loadModel() {
    const modelJSON = require('../../assets/model.json');
    const modelWeights = await [
      require('../../assets/group1-shard4of4.bin'),
      require('../../assets/group1-shard3of4.bin'),
      require('../../assets/group1-shard2of4.bin'),
      require('../../assets/group1-shard1of4.bin'),
    ];

    const model = await tf.loadLayersModel(
      tfrn.bundleResourceIO(modelJSON, modelWeights),
    );

    return model;
  }

  function preprocessImage(userImage: any) {
    const tensor = tf.browser.fromPixels(userImage);

    return tensor;
  }

  async function predict(userImage: any) {
    const model = await loadModel();

    // const tensor = preprocessImage(userImage);

    // const prediction = model.predict(tensor);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Plant disease</Text>
        <ImagePickerComponent userImage={setUserImage} />
        <View>
          <Text>Your plant is: </Text>
        </View>
        <Button title="predict" onPress={() => predict(userImage)} />
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
