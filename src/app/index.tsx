import * as tf from '@tensorflow/tfjs';
import * as tfrn from '@tensorflow/tfjs-react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePickerComponent from '../../components/ImagePicker';

export default function Page() {
  const [userImage, setUserImage] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  useEffect(() => {
    async function initializeTF() {
      await tf.ready();
    }

    initializeTF();
  }, []);

  async function loadModel() {
    const modelJSON = require('../../assets/model.json');
    const modelWeights = await [
      require('../../assets/group1-shard1of4.bin'),
      require('../../assets/group1-shard2of4.bin'),
      require('../../assets/group1-shard3of4.bin'),
      require('../../assets/group1-shard4of4.bin'),
    ];
    const model = await tf.loadLayersModel(
      tfrn.bundleResourceIO(modelJSON, modelWeights),
    );
    return model;
  }

  async function preprocessImage(userImage: string) {
    const imageUri = userImage;
    const response = await tfrn.fetch(imageUri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);

    // Decode image data to a tensor
    const imageTensor = tfrn
      .decodeJpeg(imageData)
      .resizeNearestNeighbor([224, 224]) // Resize to match the model's input dimensions
      .expandDims(); // Add batch dimension

    return imageTensor;
  }

  async function predict(userImage: string) {
    setIsPending(true);
    try {
      const model = await loadModel();

      const tensor = await preprocessImage(userImage);

      const prediction = model.predict(tensor);
      console.log(prediction);
    } catch (error) {
      console.log(error);
    }
    setIsPending(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Plant disease</Text>
        <ImagePickerComponent userImage={setUserImage} />
        {isPending && <ActivityIndicator size="large" />}
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
