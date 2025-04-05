import { View, StyleSheet, useWindowDimensions } from 'react-native';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import Chat from '../screens/Chat';
import Profile from '../screens/Profile';
import MoodTracker from '../screens/MoodTracker';
import ComingSoonScreen from '../screens/AddPeople';
import ComingSoon from '../screens/AddPeople';

type DrawerParamList = {
    Chat: undefined;
    MoodTracker: undefined;
    GoalSetting: undefined;
    Journal: undefined;
    Profile: undefined;
    AddPeople: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label='Chat'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='chatbubble-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('Chat')}
                />
                <DrawerItem
                    label='Mood Tracker'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='heart-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('MoodTracker')}
                />
                <DrawerItem
                    label='Goals'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='flag-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('GoalSetting')}
                />
                <DrawerItem
                    label='Journal'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='book-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('Journal')}
                />
            </DrawerContentScrollView>

            <View style={styles.footerContainer}>
                <DrawerItem
                    label='Profile'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='person-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('Profile')}
                />
                <DrawerItem
                    label='Add People'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='person-add-outline' size={24} color='black' />}
                    onPress={() => props.navigation.navigate('AddPeople')}
                />
            </View>
        </View>
    );
};

export default function DrawerNavigation() {
    const navigation = useNavigation();
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            initialRouteName='Chat'
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerTintColor: '#000',
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 0, // Remove border
                    elevation: 0, // Remove shadow on Android
                    shadowOpacity: 0, // Remove shadow on iOS
                },
                drawerType: isLargeScreen ? 'permanent' : 'front',
                headerLeft: isLargeScreen
                    ? () => null
                    : () => (
                        <Ionicons
                          name='menu'
                          size={24}
                          color='black'
                          style={styles.menuIcon}
                          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    ),
            }}
        >
            <Drawer.Screen name='Chat' component={Chat} />
            <Drawer.Screen name='MoodTracker' component={MoodTracker} options={{ headerTitle: "Mood Tracker" }} />
            <Drawer.Screen name='GoalSetting' component={ComingSoon} options={{ headerTitle: "Goals" }} />
            <Drawer.Screen name='Journal' component={ComingSoon} />
            <Drawer.Screen name='Profile' component={ComingSoon} />
            <Drawer.Screen name='AddPeople' component={ComingSoon} options={{ headerTitle: "Add People" }} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Changed background color for a light theme
        backgroundColor: '#f7f7f7',
        padding: 8,
        paddingTop: 16,
    },
    drawerItemLabel: {
        // Updated label color for light theme
        color: '#000',
    },
    footerContainer: {
        borderTopColor: '#00000033',
        borderTopWidth: 1,
        marginBottom: 20,
        paddingTop: 10,
    },
    menuIcon: {
        marginHorizontal: 14,
    },
});
