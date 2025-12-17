import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import FooterNavigation from '../../../components/FooterNavigation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/types';
import styles from './styles';
import setaCurvadaIcon from '../../../../assets/icons/Seta-Curvada.png';

interface MenuItemProps {
  icon?: string;
  iconImage?: any;
  text: string;
  badge?: number;
  lastItem?: boolean;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, iconImage, text, badge, lastItem, onPress }) => (
  <TouchableOpacity style={[styles.menuItem, !lastItem && styles.menuItemBorder]} onPress={onPress}>
    <View style={styles.menuLeft}>
      {iconImage ? (
        <Image source={iconImage} style={styles.menuIconImage} resizeMode="contain" />
      ) : (
        <Ionicons name={icon as any} size={24} color="#FFF" />
      )}
      <Text style={styles.menuText}>{text}</Text>
    </View>
    
    <View style={styles.menuRight}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={24} color="#FFF" />
    </View>
  </TouchableOpacity>
);

type NavigationProps = StackNavigationProp<AppStackParamList, 'ProfileScreen'>;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#33CA7F" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* --- Header do Perfil --- */}
          <View style={styles.header}>
            <View>
              <Text style={styles.roleText}>{user?.is_admin ? 'ADMIN' : 'USER'}</Text>
              <Text style={styles.nameText}>{user ? `${user.name} ${user.last_name}` : 'Usuário'}</Text>
              <Text style={styles.emailText}>{user?.email ? user.email.toUpperCase() : ''}</Text>
            </View>
            <Ionicons name="person-circle" size={50} color="#fff" />
          </View>
          <View style={styles.divider} />

          {/* --- Menu Lista --- */}
          <View style={styles.menuContainer}>
            <MenuItem 
              icon="document-text" 
              text="Dados da Conta" 
              onPress={() => navigation.navigate('EditarDados')}
            />
            <MenuItem 
              icon="notifications-outline" 
              text="Notificações" 
            />
            {user?.is_admin ? (
              <>
                <MenuItem icon="card" text="Pagamentos" />
                <MenuItem iconImage={setaCurvadaIcon} text="Gerir Usuários" lastItem />
              </>
            ) : (
              <>
                <MenuItem icon="card" text="Pagamentos" />
                <MenuItem 
                  iconImage={setaCurvadaIcon} 
                  text="Convidar Usuário" 
                  lastItem
                  onPress={() => navigation.navigate('ConvidarUsuario')}
                />
              </>
            )}
          </View>

          {/* --- Footer (Ajuda e Logout) --- */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.helpButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="help-circle-outline" size={24} color="#FFF" />
                <Text style={styles.menuText}>Ajuda</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <FooterNavigation role={user?.is_admin ? "ADMIN" : "USER"} />
    </View>
  );
};

export default ProfileScreen;

