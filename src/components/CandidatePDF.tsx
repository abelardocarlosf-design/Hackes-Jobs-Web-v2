import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00', // Brand orange
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#0A2540', // Brand blue
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  }
});

interface CandidatePDFProps {
  name: string;
  email: string;
  date: string;
}

export const CandidatePDF = ({ name, email, date }: CandidatePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Hacke's Jobs</Text>
        <Text style={styles.subtitle}>Registro de Nuevo Candidato</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Candidato</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Fecha de Registro</Text>
        <Text style={styles.value}>{date}</Text>
      </View>
      <Text style={styles.footer}>Documento generado automáticamente por Hacke's Jobs Platform</Text>
    </Page>
  </Document>
);
