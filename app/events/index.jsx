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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getEvents } from "../../database/db";
import { flagImages } from "../../database/flagImages";

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  // ⬅ Android back button (zatvara modal)
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

  // 🌍 lista drzava
  const countries = [...new Set(events.map(e => e.countryname))];

  // 🔍 filtrirani eventi
  const filteredEvents = selectedCountry
    ? events.filter(e => e.countryname === selectedCountry)
    : events;

  return (
    <View style={styles.container}>

      {/* 🔎 FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedCountry && styles.filterButtonActive
          ]}
          onPress={() => setSelectedCountry(null)}
        >
          <Text style={[
            styles.filterText,
            !selectedCountry && styles.filterTextActive
          ]}>
            СВA ДЕШАВАЊА
          </Text>
        </TouchableOpacity>

        {countries.map(country => (
          <TouchableOpacity
            key={country}
            style={[
              styles.filterButton,
              selectedCountry === country && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCountry(country)}
          >
            {flagImages[country] && (
              <Image
                source={flagImages[country]}
                style={styles.filterFlag}
                resizeMode="contain"
              />
            )}
            <Text style={[
              styles.filterText,
              selectedCountry === country && styles.filterTextActive
            ]}>
              {country}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📄 EVENTS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20, // ✅ FIX FOR ANDROID NAV BAR
        }}
      >
        {filteredEvents.map(event => (
          <View key={event.eventid} style={styles.eventCard}>

            <Text style={styles.eventTitle}>{event.title}</Text>

            <Text style={styles.eventInfo}>
              {event.townname}, {event.countryname}
            </Text>

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

            {/* 🇷🇸 ZASTAVA DOLE DESNO */}
            {flagImages[event.countryname] && (
              <Image
                source={flagImages[event.countryname]}
                style={styles.flagBottomRight}
                resizeMode="contain"
              />
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
    backgroundColor: "#0e66e9ff",
  },

  /* FILTER */
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  filterButtonActive: {
    backgroundColor: "#062b66",
  },

  filterText: {
    fontSize: 13,
    color: "#000",
    marginLeft: 4,
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  filterFlag: {
    width: 20,
    height: 14,
  },

  /* EVENT CARD */
  eventCard: {
    backgroundColor: "#b6c98bff",
    marginBottom: 14,
    borderRadius: 12,
    padding: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingRight: 50,
  },

  eventInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    paddingRight: 50,
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

  flagBottomRight: {
    width: 40,
    height: 26,
    position: "absolute",
    right: 12,
    bottom: 12,
    borderWidth: 0.7,
    borderColor: "#bbb",
    borderRadius: 2,
    opacity: 0.9,
  },

  /* MODAL */
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
