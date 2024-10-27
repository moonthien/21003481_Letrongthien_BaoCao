import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen({ route }) {

    const { cartItems, updateCartItems } = route.params || {};
    const [cartData, setCartData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            setModalMessage('Giỏ hàng trống');
            setModalVisible(true);
            return;
        }

        const initialData = cartItems.map(item => ({
            ...item,
            quantity: item.quantity || 1,
        }));
        setCartData(initialData);
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const total = cartData.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
        return total;
    };

    const updateQuantity = (id, action) => {
        const updatedCart = cartData.map(item => {
            if (item.id === id) {
                const newQuantity = action === 'increase' ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartData(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cartData.filter(item => item.id !== id);
        setCartData(updatedCart);
        
        // Gọi hàm callback để cập nhật giỏ hàng ở ElectronicsScreen
        if (updateCartItems) {
            updateCartItems(updatedCart);
        }

        setModalMessage('Sản phẩm đã được xóa khỏi giỏ hàng');
        setModalVisible(true);
    };

    const handleCheckout = () => {
        if (cartData.length === 0) {
            setModalMessage('Giỏ hàng trống, không thể tính tiền!');
            setModalVisible(true);
            return;
        }

        const totalAmount = calculateTotalPrice();
        console.log(`Total Amount: ${totalAmount}`);
        setModalMessage('Tính tiền thành công');
        setModalVisible(true);

        setCartData([]);
        setTimeout(() => {
            navigation.navigate('Login');
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ hàng</Text>
            <ScrollView style={{ width: "100%", height: 500 }}>
                {cartData.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.quantityButton}>
                                    <Text style={styles.quantityText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.quantityButton}>
                                    <Text style={styles.quantityText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                                <Text style={styles.removeButtonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            <Text style={styles.totalPrice}>Tổng tiền: ${calculateTotalPrice().toFixed(2)}</Text>
            <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Tính tiền</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                            >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
                            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: '#333',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00A8E8',
        borderRadius: 15,
        marginHorizontal: 5,
    },
    quantityText: {
        color: '#fff',
        fontSize: 16,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        marginTop: 10,
        backgroundColor: '#FF4C4C',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    checkoutButton: {
        backgroundColor: '#00A8E8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#0ad4fa',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
