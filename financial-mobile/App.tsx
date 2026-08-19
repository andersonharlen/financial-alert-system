import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Lista dos ativos mais negociados na B3
const ATIVOS_POPULARES = ['PETR4', 'VALE3', 'ITUB4', 'BBAS3', 'WEGE3', 'MXRF11'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'alertas' | 'calculadora'>('alertas');

  // Estados do Formulário de Alerta
  const [ticker, setTicker] = useState('PETR4');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');

  // Estados da Calculadora
  const [aporte, setAporte] = useState('100');
  const [prazoAnos, setPrazoAnos] = useState('5');
  const [taxaAnual, setTaxaAnual] = useState('10');
  const [resultadoCalc, setResultadoCalc] = useState<string | null>(null);

  // --- MÁSCARAS DE ENTRADA ---
  const handlePriceChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '');
    if (!numbersOnly) {
      setPrice('');
      return;
    }
    const floatVal = (parseFloat(numbersOnly) / 100).toFixed(2);
    setPrice(floatVal.replace('.', ','));
  };

  const handlePhoneChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '').slice(0, 11);
    let formatted = numbersOnly;
    if (numbersOnly.length > 2) {
      formatted = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    }
    if (numbersOnly.length > 7) {
      formatted = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7)}`;
    }
    setPhone(formatted);
  };

  const handleCadastrarAlerta = async () => {
    if (!ticker || !price || !phone) {
      alert('Preencha todos os campos!');
      return;
    }

    const rawPrice = parseFloat(price.replace(',', '.'));
    const rawPhone = '55' + phone.replace(/\D/g, '');

    try {
      await fetch('http://localhost:5022/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker,
          targetPrice: rawPrice,
          phoneNumber: rawPhone,
        }),
      });
      alert(`Alerta cadastrado com sucesso para ${ticker}!`);
      setPrice('');
      setPhone('');
    } catch (err) {
      alert('Erro ao conectar com a API backend.');
    }
  };

  const handleCalcularMeta = () => {
    const p = parseFloat(aporte) || 0;
    const n = (parseFloat(prazoAnos) || 0) * 12;
    const i = Math.pow(1 + (parseFloat(taxaAnual) || 0) / 100, 1 / 12) - 1;

    if (i === 0 || n === 0) return;

    const total = p * ((Math.pow(1 + i, n) - 1) / i);
    setResultadoCalc(total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.mobileWrapper}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Olá, <Text style={{ fontWeight: 'bold' }}>Anderson</Text></Text>
            <Text style={styles.subHeader}>Financial Intelligence</Text>
          </View>
          <View style={styles.statusBadgeContainer}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.statusText}> Online</Text>
          </View>
        </View>

        {/* Conteúdo */}
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === 'alertas' ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Cadastrar Alerta B3</Text>
              <Text style={styles.sectionSubtitle}>Monitore ativos e receba notificações no WhatsApp</Text>

              {/* SELEÇÃO DE ATIVO (BOTÕES RÁPIDOS) */}
              <Text style={styles.label}>SELECIONE O ATIVO B3</Text>
              <View style={styles.tickerContainer}>
                {ATIVOS_POPULARES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.tickerChip,
                      ticker === item && styles.tickerChipSelected,
                    ]}
                    onPress={() => setTicker(item)}
                  >
                    <Text
                      style={[
                        styles.tickerChipText,
                        ticker === item && styles.tickerChipTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>PREÇO ALVO (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={price}
                onChangeText={handlePriceChange}
              />

              <Text style={styles.label}>WHATSAPP</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={15}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleCadastrarAlerta}>
                <Text style={styles.primaryButtonText}>CADASTRAR ALERTA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Simulador de Investimentos</Text>
              <Text style={styles.sectionSubtitle}>Calcule projeções para potenciais clientes</Text>

              <Text style={styles.label}>APORTE MENSAL (R$)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={aporte}
                onChangeText={setAporte}
              />

              <Text style={styles.label}>PRAZO (ANOS)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={prazoAnos}
                onChangeText={setPrazoAnos}
              />

              <Text style={styles.label}>TAXA ESTIMADA (% AO ANO)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={taxaAnual}
                onChangeText={setTaxaAnual}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleCalcularMeta}>
                <Text style={styles.primaryButtonText}>CALCULAR PROJEÇÃO</Text>
              </TouchableOpacity>

              {resultadoCalc && (
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Patrimônio Estimado</Text>
                  <Text style={styles.resultValue}>R$ {resultadoCalc}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('alertas')}
          >
            <Feather 
              name="bell" 
              size={20} 
              color={activeTab === 'alertas' ? '#26D367' : '#555555'} 
            />
            <Text style={[styles.navText, activeTab === 'alertas' && styles.navActive]}>
              Alertas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('calculadora')}
          >
            <Feather 
              name="sliders" 
              size={20} 
              color={activeTab === 'calculadora' ? '#26D367' : '#555555'} 
            />
            <Text style={[styles.navText, activeTab === 'calculadora' && styles.navActive]}>
              Simulador
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mobileWrapper: {
    flex: 1,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#0F0F0F',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1F1F1F',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  subHeader: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C281F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    color: '#26D367',
    fontSize: 10,
  },
  statusText: {
    color: '#26D367',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#777',
    fontSize: 12,
    marginBottom: 20,
    marginTop: 4,
  },
  label: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tickerChip: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  tickerChipSelected: {
    backgroundColor: '#1C281F',
    borderColor: '#26D367',
  },
  tickerChipText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tickerChipTextSelected: {
    color: '#26D367',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#26D367',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: '#1A231C',
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    borderColor: '#26D367',
    borderWidth: 1,
  },
  resultLabel: {
    color: '#AAA',
    fontSize: 12,
  },
  resultValue: {
    color: '#26D367',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#141414',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    color: '#555555',
    marginTop: 4,
  },
  navActive: {
    color: '#26D367',
    fontWeight: 'bold',
  },
});