import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'registro-servicos.json';

export const carregaRegistro = async () => {
  try {
    const fileData = await FileSystem.readAsStringAsync(fileUri);
    if (fileData) {
      return JSON.parse(fileData); // Converte o JSON para um array
    }
    return []; // Se o arquivo estiver vazio ou não for encontrado, retorna um array vazio
  } catch (error) {
    console.log('Erro ao ler os registros:', error);
    return []; // Se houver erro ao ler o arquivo, retorna um array vazio
  }
};

export const salvaRegistro = async (newRecord) => {
  const records = await carregaRegistro();
  const updatedRecords = [...records, newRecord];

  try {
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedRecords)); // Salva os registros no arquivo
    console.log('Registro salvo com sucesso!');
  } catch (error) {
    console.log('Erro! Tente novamente.', error);
  }
};

export const excluiRegistro = async (index) => {
  const records = await carregaRegistro();
  records.splice(index, 1);

  try {
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(records));
    console.log('Registro excluído com sucesso!');
  } catch (error) {
    console.log('Erro ao excluir o registro:', error);
  }
};
