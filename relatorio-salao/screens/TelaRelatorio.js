import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { carregaRegistro, excluiRegistro } from '../storage/Dados';

const TelaRelatorio = () => { //carrega dados e filtros
  const [registros, setRegistro] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [filtraNome, setFiltraNome] = useState('');
  const [filtraServico, setFiltraServico] = useState('');
  const [ordem, setOrdem] = useState('asc');

  useEffect(() => { //carregar e exibir os registros
    async function fetchRegistros() {
      const loadedRegistros = await carregaRegistro();
      setRegistro(loadedRegistros);
      setFilteredRegistros(loadedRegistros);
    };

    fetchRegistros();
  }, []);

  // Exclusão de registro
  const handleDelete = async (index) => {
    await excluiRegistro(index); 
    const updatedRegistros = await carregaRegistro();
    setRegistro(updatedRegistros);
    aplicaFiltros(updatedRegistros);
  };

  // Filtros
  const aplicaFiltros = () => {
    let dadoFiltrado = registros;

    if (filtraNome.trim() !== '') {
      dadoFiltrado = dadoFiltrado.filter(registro =>
        registro.nome.toLowerCase().includes(filtraNome.toLowerCase())
      );
    }

    if (filtraServico.trim() !== '') {
      dadoFiltrado = dadoFiltrado.filter(registro =>
        registro.servico.toLowerCase().includes(filtraServico.toLowerCase())
      );
    }

    // Ordenação por data
    dadoFiltrado = dadoFiltrado.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-')); 

      return ordem === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredRegistros(dadoFiltrado);
  };

  // Atualização do filtro
  const handleFilterChange = () => {
    if (filtraNome.trim() === '' && filtraServico.trim() === '') {
      setFilteredRegistros(registros);
    } else {
      aplicaFiltros();
    }
  };

  const aplicaOrdem = () => {
    const novaOrdem = ordem === 'asc' ? 'desc' : 'asc';
    setOrdem(novaOrdem);
    aplicaFiltros();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório</Text>

      {/* Filtra nome */}
      <TextInput
        style={styles.input}
        placeholder="Buscar nome"
        value={filtraNome}
        onChangeText={(text) => {
          setFiltraNome(text); 
          handleFilterChange();
        }}
      />

      {/* Filtra serviço */}
      <TextInput
        style={styles.input}
        placeholder="Buscar serviço"
        value={filtraServico}
        onChangeText={(text) => {
          setFiltraServico(text); 
          handleFilterChange();
        }}
      />

      <TouchableOpacity style={styles.botaoOrdenar} onPress={aplicaOrdem}>
        <Text style={styles.botaoOrdenarTexto}>
          Ordenar por Data ({ordem === 'asc' ? 'Crescente' : 'Decrescente'})
        </Text>
      </TouchableOpacity>

      {/* Mostra registros de acordo com o filtro e mensagem caso negativo */}
      {filteredRegistros.length > 0 ? (
        <FlatList
          data={filteredRegistros}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.registro}>
              <Text style={styles.recordText}><Text style={styles.bold}>Nome:</Text> {item.nome}</Text>
              <Text style={styles.recordText}><Text style={styles.bold}>Serviço:</Text> {item.servico}</Text>
              <Text style={styles.recordText}><Text style={styles.bold}>Data:</Text> {item.date}</Text>
              <Text style={styles.recordText}><Text style={styles.bold}>Telefone:</Text> {item.telefone}</Text>

              {/* Botão de exclusão */}
              <TouchableOpacity 
                style={styles.botaoExcluir} 
                onPress={() => handleDelete(index)} 
              >
                <Text style={styles.botaoExcluirTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noRegistros}>Registro não localizado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  registro: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '100%',
  },
  recordText: {
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  noRegistros: {
    fontSize: 22,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 15,
  },
  botaoExcluir: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoExcluirTexto: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'black', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#474747',
    borderRadius: 15,
    fontSize: 16,
  },
  botaoOrdenar: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoOrdenarTexto: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'black', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default TelaRelatorio;
