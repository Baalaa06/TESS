import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { getIncidents } from "@/storage/localStore";
import { isFirebaseEnabled } from "@/config/firebase";

export default function LogsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Failed to load incidents:", error);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTrustColor = (trust) => {
    if (trust >= 0.75) return '#4CAF50';
    if (trust >= 0.45) return '#FF9800';
    return '#F44336';
  };

  const getTrustLabel = (trust) => {
    if (trust >= 0.75) return '🟢 HIGH';
    if (trust >= 0.45) return '🟡 MEDIUM';
    return '🔴 LOW';
  };

  const renderIncident = ({ item }) => (
    <View style={styles.incidentCard}>
      <View style={styles.incidentHeader}>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        <Text style={[styles.trustBadge, { color: getTrustColor(item.trust) }]}>
          {getTrustLabel(item.trust)}
        </Text>
      </View>
      
      <Text style={styles.action}>Action: {item.action}</Text>
      <Text style={styles.message}>{item.message}</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>🔋 Battery: {item.battery}%</Text>
        <Text style={styles.detail}>📶 Network: {item.network}</Text>
        <Text style={styles.detail}>📍 Location: {item.location || 'Unknown'}</Text>
        <Text style={styles.detail}>🤖 AI Confidence: {item.aiConfidence ? `${Math.round(item.aiConfidence * 100)}%` : 'N/A'}</Text>
        <Text style={styles.detail}>
          🎤 Mic: {item.sensors?.mic ? 'Available' : 'Unavailable'}
        </Text>
        <Text style={styles.detail}>
          📱 Motion: {item.sensors?.accelerometer ? 'Available' : 'Unavailable'}
        </Text>
      </View>
      
      {item.context && (
        <View style={styles.contextContainer}>
          <Text style={styles.contextText}>
            Context: {item.context.hour}:00, Movement: {item.context.movementLevel}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incident Timeline</Text>
      <Text style={styles.subtitle}>
        {incidents.length} incident{incidents.length !== 1 ? 's' : ''} logged
        {isFirebaseEnabled ? ' (Firebase)' : ' (Local)'}
      </Text>
      
      {incidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No incidents recorded yet</Text>
          <Text style={styles.emptySubtext}>
            Press the SOS button on the Trust Dashboard to create your first incident log
          </Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          renderItem={renderIncident}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  incidentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  trustBadge: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  action: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 18,
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  detail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contextContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  contextText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});