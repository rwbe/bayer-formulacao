import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import {
  defaultRecipes,
  defaultChemistry,
  defaultProcedures,
  defaultTutorials,
  defaultEPIs,
  defaultSafetyTips,
} from '../src/guideData';

const { width } = Dimensions.get('window');

export default function GuideDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { itemId, category, title } = useLocalSearchParams();

  const selectedItem = useMemo(() => {
    if (category === 'produtos' || category === 'receita') {
      return defaultRecipes.find((_, i) => `${category === 'receita' ? 'rec' : 'prod'}-${i}` === itemId);
    }
    if (category === 'quimica') {
      return defaultChemistry.find((_, i) => `chem-${i}` === itemId);
    }
    if (category === 'procedimentos') {
      return defaultProcedures.find((_, i) => `proc-${i}` === itemId);
    }
    if (category === 'tutorial') {
      return defaultTutorials.find((_, i) => `tut-${i}` === itemId);
    }
    if (category === 'epis') {
      return defaultEPIs.find((_, i) => `epi-${i}` === itemId);
    }
    if (category === 'seguranca') {
      return defaultSafetyTips.find((_, i) => `safe-${i}` === itemId);
    }
    return null;
  }, [itemId, category]);

  const getCategoryColor = () => {
    switch (category) {
      case 'produtos':
        return { main: '#00BCFF', gradient: ['#00BCFF', '#0099CC'] };
      case 'receita':
        return { main: '#10B981', gradient: ['#10B981', '#059669'] };
      case 'quimica':
        return { main: '#89D329', gradient: ['#89D329', '#6BA31F'] };
      case 'procedimentos':
        return { main: '#F59E0B', gradient: ['#F59E0B', '#D97706'] };
      case 'tutorial':
        return { main: '#EC4899', gradient: ['#EC4899', '#BE185D'] };
      case 'epis':
        return { main: '#8B5CF6', gradient: ['#8B5CF6', '#6D28D9'] };
      case 'seguranca':
        return { main: '#EF4444', gradient: ['#EF4444', '#DC2626'] };
      default:
        return { main: '#6B7280', gradient: ['#6B7280', '#4B5563'] };
    }
  };

  const colorScheme = getCategoryColor();

  const getIconName = () => {
    switch (category) {
      case 'produtos':
      case 'receita':
        return 'flask';
      case 'quimica':
        return 'leaf';
      case 'procedimentos':
        return 'cog';
      case 'tutorial':
        return 'play-circle';
      case 'epis':
        return 'shield';
      case 'seguranca':
        return 'alert-circle';
      default:
        return 'book';
    }
  };

  const renderRecipeDetail = () => {
    const recipe = selectedItem as any;
    return (
      <>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Informações Básicas
          </Text>
          <View style={[styles.infoBox, { borderLeftColor: colorScheme.main }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Produto:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{recipe.product}</Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Receita:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{recipe.recipe}</Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Ingrediente Ativo:
              </Text>
              <Text
                style={[styles.infoValue, { color: colors.textPrimary }]}
                numberOfLines={3}
              >
                {recipe.active_ingredient}
              </Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Categoria:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {recipe.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Tempo de Massagem
          </Text>
          <LinearGradient colors={colorScheme.gradient} style={styles.timeHighlight}>
            <Ionicons name="time-outline" size={24} color="#FFFFFF" />
            <Text style={styles.timeText}>{recipe.massageTime || recipe.duration}</Text>
          </LinearGradient>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Função</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {recipe.func}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Aplicação</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {recipe.application}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notas</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {recipe.notes}
          </Text>
        </View>
      </>
    );
  };

  const renderChemistryDetail = () => {
    const chem = selectedItem as any;
    return (
      <>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Informações Gerais
          </Text>
          <View style={[styles.infoBox, { borderLeftColor: colorScheme.main }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Alias:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{chem.alias}</Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Classe:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{chem.className}</Text>
            </View>
            {chem.molecularFormula && (
              <>
                <View style={styles.dividerSmall} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Fórmula Molecular:
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                    {chem.molecularFormula}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Mecanismo</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {chem.func}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Aplicações</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {chem.applications}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Segurança</Text>
          <View style={[styles.warningBox, { backgroundColor: colorScheme.main + '15' }]}>
            <Ionicons name="alert-circle-outline" size={20} color={colorScheme.main} />
            <Text style={[styles.warningText, { color: colors.textPrimary }]}>
              {chem.safety}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderProcedureDetail = () => {
    const proc = selectedItem as any;
    return (
      <>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Descrição</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {proc.content}
          </Text>
        </View>

        {proc.steps && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Passos</Text>
            {proc.steps.map((step: string, idx: number) => (
              <View key={idx} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: colorScheme.main },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}

        {proc.tips && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Dicas</Text>
            {proc.tips.map((tip: string, idx: number) => (
              <View key={idx} style={[styles.tipItem, { borderLeftColor: colorScheme.main }]}>
                <Ionicons name="bulb-outline" size={16} color={colorScheme.main} />
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderTutorialDetail = () => {
    const tut = selectedItem as any;
    return (
      <>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Sobre o Tutorial
          </Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {tut.description}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Informações
          </Text>
          <View style={[styles.infoBox, { borderLeftColor: colorScheme.main }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duração:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {tut.duration}
              </Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nível:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {tut.level}
              </Text>
            </View>
          </View>
        </View>

        {tut.videoUrl && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Vídeo Tutorial
            </Text>
            <TouchableOpacity
              style={[styles.videoCard, { borderColor: colorScheme.main }]}
              onPress={() => tut.videoUrl && Linking.openURL(tut.videoUrl)}
            >
              {tut.videoThumbnail && (
                <Image
                  source={{ uri: tut.videoThumbnail }}
                  style={styles.videoThumbnail}
                />
              )}
              <View style={[styles.videoOverlay, { backgroundColor: colorScheme.main + 'ee' }]}>
                <Ionicons name="play-circle-outline" size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.videoLabel}>Assistir no YouTube</Text>
            </TouchableOpacity>
          </View>
        )}

        {tut.content && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Conteúdo
            </Text>
            <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
              {tut.content}
            </Text>
          </View>
        )}

        {tut.steps && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Etapas
            </Text>
            {tut.steps.map((step: string, idx: number) => (
              <View key={idx} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: colorScheme.main },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderEPIDetail = () => {
    const epi = selectedItem as any;
    return (
      <>
        {epi.image && (
          <View style={styles.detailSection}>
            <Image
              source={{ uri: epi.image }}
              style={styles.epiImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Sobre o EPI
          </Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {epi.description}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Informações
          </Text>
          <View style={[styles.infoBox, { borderLeftColor: colorScheme.main }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Categoria:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {epi.category}
              </Text>
            </View>
            <View style={styles.dividerSmall} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Importância:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      epi.importance === 'Crítico'
                        ? '#EF4444'
                        : epi.importance === 'Alto'
                          ? '#F59E0B'
                          : '#3B82F6',
                  },
                ]}
              >
                {epi.importance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Uso</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {epi.usage}
          </Text>
        </View>

        {epi.maintenanceTips && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Dicas de Manutenção
            </Text>
            {epi.maintenanceTips.map((tip: string, idx: number) => (
              <View key={idx} style={[styles.tipItem, { borderLeftColor: colorScheme.main }]}>
                <Ionicons name="checkmark-done-outline" size={16} color={colorScheme.main} />
                <Text style={[styles.tipText, { color: colors.textPrimary }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderSafetyDetail = () => {
    const safety = selectedItem as any;
    return (
      <>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Risco</Text>
          <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>
            {safety.description}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Nível</Text>
          <View
            style={[
              styles.severityBox,
              {
                backgroundColor:
                  safety.severity === 'Crítico'
                    ? '#EF4444'
                    : safety.severity === 'Alto'
                      ? '#F59E0B'
                      : '#3B82F6',
              },
            ]}
          >
            <Text style={styles.severityText}>{safety.severity}</Text>
          </View>
        </View>

        {safety.preventionSteps && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Prevenção
            </Text>
            {safety.preventionSteps.map((step: string, idx: number) => (
              <View key={idx} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNumber,
                    {
                      backgroundColor:
                        safety.severity === 'Crítico'
                          ? '#EF4444'
                          : safety.severity === 'Alto'
                            ? '#F59E0B'
                            : '#3B82F6',
                    },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient colors={colorScheme.gradient} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <Ionicons name={getIconName()} size={32} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {!selectedItem ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Conteúdo não encontrado
            </Text>
          </View>
        ) : (
          <>
            {category === 'produtos' || category === 'receita'
              ? renderRecipeDetail()
              : category === 'quimica'
                ? renderChemistryDetail()
                : category === 'procedimentos'
                  ? renderProcedureDetail()
                  : category === 'tutorial'
                    ? renderTutorialDetail()
                    : category === 'epis'
                      ? renderEPIDetail()
                      : category === 'seguranca'
                        ? renderSafetyDetail()
                        : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginHorizontal: 16,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  infoBox: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 0.35,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 0.65,
    textAlign: 'right',
  },
  dividerSmall: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  timeHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  warningBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  videoCard: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  videoLabel: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 2,
  },
  epiImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 12,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  severityBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
  },
});
