import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { salvaRegistro } from '../storage/Dados';

const TelaInicial = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('');
  const [telefone, setTelefone] = useState('');
  const [date, setDate] = useState('');

  const formataData = (input) => {
    let dataFormatada = input.replace(/[^\d]/g, '');

    if (dataFormatada.length > 2) {
      dataFormatada = dataFormatada.slice(0, 2) + '/' + dataFormatada.slice(2);
    }
    if (dataFormatada.length > 5) {
      dataFormatada = dataFormatada.slice(0, 5) + '/' + dataFormatada.slice(5, 9);
    }

    return dataFormatada.slice(0, 10); // Exige o formato
  };


  const registro = async () => {
    // Valida se os campos obrigatórios (nome e serviço) estão preenchidos
    if (!nome || !servico || !date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios (Nome, Serviço e Data).");
      return;
    }

    const newRecord = {
      nome,
      servico,
      date,
      telefone: telefone || 'Não preenchido',
    };

    await salvaRegistro(newRecord); // Salva o registro no arquivo
    setNome('');
    setServico('');
    setTelefone('');
    setDate('');
    Alert.alert('Registro realizado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Serviço</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da cliente"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Serviço realizado"
        value={servico}
        onChangeText={setServico}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (opcional)"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (dd/mm/aaaa)"
        value={date}
        onChangeText={(text) => setDate(formataData(text))}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botao} onPress={registro}>
        <Text style={styles.textoBotao}>Registrar Serviço</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Relatório')}>
        <Text style={styles.textoBotao}>Ver Relatório</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '##D8DFF8',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#474747',
    borderRadius: 15,
    fontSize: 18,
  },
  botao: {
    backgroundColor: '#00a4d1',
    paddingVertical: 35,
    paddingHorizontal: 45,
    borderRadius: 5,
    marginVertical: 25,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});

export default TelaInicial;
