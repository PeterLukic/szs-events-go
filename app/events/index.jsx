import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  BackHandler,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getEvents } from "../../database/db";
import { flagImages } from "../../database/flagImages";

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const data = getEvents();
    setEvents(data);
  }, []);

  // ⬅ Android back button (zatвара modal)
  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible]);

  const openImage = (link) => {
    if (link) {
      setSelectedImage(link);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {events.map((event) => (
          <View key={event.eventid} style={styles.eventCard}>

            {/* 🏳️ TITLE + FLAG */}
            <View style={styles.titleRow}>
              {flagImages[event.countryname] && (
                <Image
                  source={flagImages[event.countryname]}
                  style={styles.flagSmall}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.eventTitle}>
                {event.title}
              </Text>
            </View>

            {/* 📍 LOCATION */}
            <Text style={styles.eventInfo}>
              {event.townname}, {event.countryname}
            </Text>

            {/* 🖼 EVENT POSTER */}
            {event.link && (
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => openImage(event.link)}
              >
                <Text style={styles.imageButtonText}>
                  Прикажи плакат
                </Text>
              </TouchableOpacity>
            )}

          </View>
        ))}
      </ScrollView>

      {/* 🖼 MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },

  eventCard: {
    backgroundColor: "#b6c98bff",
    marginBottom: 14,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  flagSmall: {
    width: 30,
    height: 20,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  eventInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },

  imageButton: {
    backgroundColor: "#062b66",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width,
    height,
  },
});
