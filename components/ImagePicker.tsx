import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Button, Image, StyleSheet, View } from 'react-native';
const ImagePickerComponent = ({ userImage }: any) => {
  const [cameraPermissionInformation, requestPermission] =
    ImagePicker.useCameraPermissions();

  const [takenImage, setTakenImage] = useState<string>('');
  const [pickedImage, setPickedImage] = useState<string>('');

  const verifyPermissions = async () => {
    if (
      cameraPermissionInformation?.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } else if (
      cameraPermissionInformation?.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.',
      );
      await ImagePicker.requestCameraPermissionsAsync();
      return false;
    }
    return true;
  };

  const takeImageHandler = useCallback(async (props: string) => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return Alert.alert('No permission granted!');
    }
    if (props === 'camera') {
      const image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
      if (image.canceled) {
        return null;
      }
    } else if (props === 'image') {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        selectionLimit: 1,
        aspect: [4, 3],
        quality: 0.1,
      });
      if (image.canceled) {
        return null;
      } else {
        setPickedImage(image.assets[0].uri);
        userImage(image.assets[0].uri);
      }
    } else {
      throw new Error('Something went wrong!');
    }
  }, []);

  const imageSource =
    pickedImage !== '' ? { uri: pickedImage } : require('./icon.png');

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.imageContainer} />
      <Button title="Take image" onPress={() => takeImageHandler('image')} />
      <Button
        title="Clear image"
        onPress={() => {
          setPickedImage('');
          setTakenImage('');
        }}
      />
    </View>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 24,
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 8,
  },
});
