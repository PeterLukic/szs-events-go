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
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { getEvents } from "../../database/db";

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Country → Flag colors (3 stripes)
  const countryColors = {
    "Аустрија": ["#ED2939", "#FFFFFF", "#ED2939"],
    "Србија": ["#C6363C", "#0C4076", "#FFFFFF"],
    "Босна и Херцеговина": ["#002395", "#F7C800", "#002395"],
    "Република Српска": ["#C6363C", "#0C4076", "#FFFFFF"],
    "Словенија": ["#FFFFFF", "#0C4076", "#C6363C"],
    "Немачка": ["#000000", "#DD0000", "#FFCE00"]
  };

  useEffect(() => {
    const data = getEvents();
    setEvents(data);
  }, []);

  // Handle Android back button
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
        {events.map((event) => {
          const colors = countryColors[event.countryname] || ["#fff", "#eee", "#ddd"];

          return (
            <View key={event.eventid} style={[styles.eventCard, { padding: 0 }]}>
              {/* FLAG BACKGROUND */}
              <View style={{ backgroundColor: colors[0], height: 35 }} />
              <View style={{ backgroundColor: colors[1], height: 35 }} />
              <View style={{ backgroundColor: colors[2], height: 35 }} />

              {/* CONTENT */}
              <View style={{ padding: 15 }}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                <Text style={styles.eventInfo}>
                  {event.townname}, {event.countryname}
                </Text>

                {event.link && (
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => openImage(event.link)}
                  >
                    <Text style={styles.imageButtonText}>Прикажи билборд</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
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
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#062b66",
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    width: width,
    height: height,
  },
});
