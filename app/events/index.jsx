import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from "react-native";
import { getEventsWithDetails } from "../../database/db";
import { eventImages } from "../../database/eventImages";

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      const data = await getEventsWithDetails();
      setEvents(data);
    }
    loadEvents();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Events ({events.length})</Text>

      {events.map((ev) => (
        <View key={ev.eventid} style={styles.card}>
          <Text style={styles.title}>{ev.title}</Text>
          <Text style={styles.subtitle}>Date: {ev.eventdate}</Text>
          <Text style={styles.subtitle}>Location: {ev.townname}, {ev.countryname}</Text>

          {ev.link ? (
            <TouchableOpacity onPress={() => setSelectedImage(ev.link)}>
              <Text style={{ color: "blue" }}>Tap to view full image</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}

      <Modal visible={!!selectedImage} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setSelectedImage(null)} />
          <Image source={eventImages[selectedImage]} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { marginBottom: 15, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fafafa" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalBackground: { ...StyleSheet.absoluteFillObject },
  fullImage: { width: "90%", height: "70%", borderRadius: 10 }
});
