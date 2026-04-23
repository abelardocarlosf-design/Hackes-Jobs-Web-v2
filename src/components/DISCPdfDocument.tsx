import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Estilos para el PDF con los colores corporativos
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#EA580C', // Naranja corporativo
    paddingBottom: 10,
  },
  logoPlaceholder: {
    width: 120,
    height: 40,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A', // Azul corporativo
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#EA580C',
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  scoreRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreLabel: {
    width: 120,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111111',
  },
  scoreBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 5,
  },
  scoreValue: {
    width: 40,
    fontSize: 12,
    textAlign: 'right',
    color: '#111111',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999999',
    borderTop: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 20,
  },
  date: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  }
});

interface DISCPdfProps {
  data: {
    D: number;
    I: number;
    S: number;
    C: number;
    analysis: string;
    userName?: string;
    date: string;
  };
}

const DISCPdfDocument: React.FC<DISCPdfProps> = ({ data }) => {
  const scores = [
    { label: 'Dominancia (D)', value: data.D, color: '#EA580C' },
    { label: 'Influencia (I)', value: data.I, color: '#1E3A8A' },
    { label: 'Estabilidad (S)', value: data.S, color: '#1E3A8A' },
    { label: 'Cumplimiento (C)', value: data.C, color: '#1E3A8A' },
  ];

  // El puntaje más alto es naranja, los demás azules
  const maxVal = Math.max(data.D, data.I, data.S, data.C);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Espacio para el logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>HACKE'S JOBS</Text>
          </View>
          <Text style={styles.headerTitle}>Resultados Análisis DISC</Text>
        </View>

        {/* Info Usuario */}
        <View>
          {data.userName && <Text style={styles.userName}>Candidato: {data.userName}</Text>}
          <Text style={styles.date}>Fecha de generación: {data.date}</Text>
        </View>

        {/* Gráfico de Resultados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Puntuaciones Obtenidas</Text>
          {scores.map((s, i) => (
            <View key={i} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{s.label}</Text>
              <View style={styles.scoreBarContainer}>
                <View 
                  style={[
                    styles.scoreBar, 
                    { 
                      width: `${(s.value / 30) * 100}%`, 
                      backgroundColor: s.value === maxVal ? '#EA580C' : '#1E3A8A' 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.scoreValue}>{s.value} pts</Text>
            </View>
          ))}
        </View>

        {/* Análisis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interpretación del Perfil</Text>
          <Text style={styles.text}>{data.analysis}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Hacke's Jobs - Reclutamiento y Selección de Talento</Text>
          <Text>www.hackesjobs.com.mx</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DISCPdfDocument;
