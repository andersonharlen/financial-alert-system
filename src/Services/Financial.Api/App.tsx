import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

const API_URL = 'http://10.0.2.2:5022/api/alerts'; // Use 10.0.2.2 para Android Emulator ou seu IP local

export default function App() {
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createAlert = async () => {
    if (!ticker || !price || !phone) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, targetPrice: parseFloat(price), phoneNumber: phone }),
    });
    setTicker(''); setPrice(''); setPhone('');
    fetchAlerts();
  };

  useEffect(() => { fetchAlerts(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Financial Alert System</Text>
      
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Ativo (ex: PETR4)" placeholderTextColor="#888" value={ticker} onChangeText={setTicker} />
        <TextInput style={styles.input} placeholder="Preço Alvo (ex: 40.00)" placeholderTextColor="#888" keyboardType="numeric" value={price} onChangeText={setPrice} />
        <TextInput style={styles.input} placeholder="WhatsApp (ex: 5511999999999)" placeholderTextColor="#888" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TouchableOpacity style={styles.button} onPress={createAlert}>
          <Text style={styles.buttonText}>Cadastrar Alerta</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item: any) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.ticker}</Text>
            <Text style={styles.cardText}>Alvo: R$ {item.targetPrice}</Text>
            <Text style={styles.cardText}>Tel: {item.phoneNumber}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00E676', textAlign: 'center', marginVertical: 20 },
  form: { gap: 10, marginBottom: 20 },
  input: { backgroundColor: '#1A1A1A', color: '#FFF', padding: 12, borderRadius: 8, borderBottomWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#00E676', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold' },
  card: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 8, marginBottom: 10, borderColor: '#333', borderWidth: 1 },
  cardTitle: { color: '#00E676', fontWeight: 'bold', fontSize: 16 },
  cardText: { color: '#CCC' },
});