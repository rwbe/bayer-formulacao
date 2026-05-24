import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Image,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useTheme } from '../../src/theme';
import { useAuth, api } from '../../src/auth';

type GalleryImage = {
  id: string;
  user_id: string;
  user_name: string;
  url: string;
  caption: string;
  category: string;
  created_at: string;
};

const CATEGORIES = ['geral', 'limpeza', 'comprovacao', 'ambiente', 'outro'];

export default function GalleryScreen() {
  const { colors } = useTheme();
  const { user, token } = useAuth();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('geral');

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
  } | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<GalleryImage | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);

    try {
      const r = await api.get('/gallery', {
        params: { category: category === 'todos' ? undefined : category },
      });

      setImages(r.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao carregar galeria');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [fetchImages])
  );

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchImages();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      });
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma imagem');
      return;
    }

    setUploading(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(selectedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const r = await api.post('/gallery', {
        url: `data:image/jpeg;base64,${base64}`,
        caption: caption.trim(),
        category,
      });

      Alert.alert('Sucesso', 'Imagem enviada com sucesso');

      setSelectedImage(null);
      setCaption('');
      setUploadModalVisible(false);

      await fetchImages();
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Falha ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    Alert.alert('Remover imagem', 'Confirma a remoção desta imagem?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/gallery/${id}`);
            setDetailVisible(false);
            await fetchImages();
          } catch {
            Alert.alert('Erro', 'Falha ao remover imagem');
          }
        },
      },
    ]);
  };

  const renderImage = ({ item }: { item: GalleryImage }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedDetail(item);
        setDetailVisible(true);
      }}
      style={[
        styles.imageCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {item.url.startsWith('data:') ? (
        <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            {
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
        </View>
      )}

      <View style={styles.imageOverlay}>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: colors.primary + 'DD',
            },
          ]}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
            {item.category.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Galeria</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {images.length} {images.length === 1 ? 'foto' : 'fotos'}
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterRow}>
        {['todos', ...CATEGORIES].map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[
              styles.filterChip,
              {
                backgroundColor: category === cat ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: category === cat ? '#fff' : colors.textSecondary,
                fontWeight: '600',
                fontSize: 12,
                textTransform: 'capitalize',
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : images.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhuma foto nesta categoria
          </Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={renderImage}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 100,
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={() => setUploadModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal visible={uploadModalVisible} transparent animationType="slide">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Adicionar foto</Text>

              <TouchableOpacity
                onPress={() => {
                  setUploadModalVisible(false);
                  setSelectedImage(null);
                  setCaption('');
                }}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {!selectedImage ? (
              <View
                style={[
                  styles.imagePicker,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="image-outline" size={64} color={colors.primary} />

                <Text style={[styles.imagePickerText, { color: colors.textPrimary }]}>
                  Selecione uma foto
                </Text>

                <TouchableOpacity
                  onPress={pickImage}
                  style={[
                    styles.pickButton,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Ionicons name="image-outline" size={18} color="#fff" />
                  <Text style={styles.pickButtonText}>Escolher foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />

                <View style={styles.uploadForm}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Descrição (opcional)
                  </Text>

                  <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="Descrever a foto..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={3}
                    style={[
                      styles.captionInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      },
                    ]}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>

                  <View style={styles.categoryGrid}>
                    {CATEGORIES.map(cat => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={[
                          styles.categoryOption,
                          {
                            backgroundColor: category === cat ? colors.primary : colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: category === cat ? '#fff' : colors.textSecondary,
                            fontWeight: '600',
                            fontSize: 12,
                            textTransform: 'capitalize',
                          }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.uploadActions}>
                    <TouchableOpacity
                      onPress={() => setSelectedImage(null)}
                      style={[
                        styles.uploadActionBtn,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={uploadImage}
                      disabled={uploading}
                      style={[
                        styles.uploadActionBtn,
                        {
                          backgroundColor: colors.primary,
                          opacity: uploading ? 0.7 : 1,
                        },
                      ]}
                    >
                      {uploading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Enviar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailVisible} transparent animationType="fade">
        <View style={[styles.detailModal, { backgroundColor: colors.background + 'E6' }]}>
          <SafeAreaView style={{ flex: 1 }}>
            {selectedDetail && (
              <>
                <View style={styles.detailHeader}>
                  <TouchableOpacity onPress={() => setDetailVisible(false)} hitSlop={10}>
                    <Ionicons name="close" size={28} color="#fff" />
                  </TouchableOpacity>

                  {selectedDetail.user_id === user?.id && (
                    <TouchableOpacity onPress={() => deleteImage(selectedDetail.id)} hitSlop={10}>
                      <Ionicons name="trash" size={24} color="#FF4B4B" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.detailContent}>
                  {selectedDetail.url.startsWith('data:') ? (
                    <Image
                      source={{ uri: selectedDetail.url }}
                      style={styles.detailImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceElevated }]}
                    >
                      <Ionicons name="image-outline" size={64} color={colors.textTertiary} />
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.detailInfo,
                    {
                      backgroundColor: colors.surface,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor: colors.primary + '44',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 11,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedDetail.category}
                    </Text>
                  </View>

                  {selectedDetail.caption && (
                    <Text style={[styles.detailCaption, { color: colors.textPrimary }]}>
                      {selectedDetail.caption}
                    </Text>
                  )}

                  <Text style={[styles.detailMeta, { color: colors.textSecondary }]}>
                    Por {selectedDetail.user_name} •{' '}
                    {new Date(selectedDetail.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap',
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },

  row: {
    gap: 12,
    marginBottom: 12,
  },

  imageCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },

  image: {
    flex: 1,
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  modal: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  imagePicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 16,
  },

  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
  },

  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  pickButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  previewImage: {
    width: '100%',
    height: '50%',
  },

  uploadForm: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  captionInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },

  categoryGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },

  uploadActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },

  uploadActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },

  detailModal: {
    flex: 1,
  },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  detailContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailImage: {
    width: '100%',
    height: '100%',
  },

  detailInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },

  detailCaption: {
    fontSize: 14,
    lineHeight: 20,
  },

  detailMeta: {
    fontSize: 12,
  },
});
