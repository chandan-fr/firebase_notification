import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const ShimmerView = createShimmerPlaceholder(LinearGradient);

type ListManipulationProps = {
    navigation: any;
};
type CustomShimmerComponentProps = {
    len: number;
};

type Product = {
    thumbnail: string;
    price: string;
    title: string;
    description: string;
    isSelected?: boolean;
};

const BaseShimmerComp = (): JSX.Element => (
    <View style={styles.itemCont}>
        <ShimmerView
            style={{ width: 100, height: 100, borderRadius: 10, }}
            shimmerColors={["#2EBB92", "#808886", "#F19733"]}
        />
        <View style={styles.rightBox}>
            <ShimmerView
                style={{ width: 200, marginBottom: 15, borderRadius: 10 }}
                shimmerColors={["#2EBB92", "#808886", "#F19733"]}
            />
            <ShimmerView
                style={{ width: 150, marginBottom: 6, borderRadius: 10 }}
                shimmerColors={["#2EBB92", "#808886", "#F19733"]}
            />
            <ShimmerView
                style={{ width: 250, height: 40, borderRadius: 10 }}
                shimmerColors={["#2EBB92", "#808886", "#F19733"]}
            />
        </View>
    </View>
)

const CustomShimmerComponent = ({ len }: CustomShimmerComponentProps): JSX.Element => {
    const shimmerArray = Array.from({ length: len }, (_, index) => index);

    return (
        <FlatList
            data={shimmerArray}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
                <>
                    <BaseShimmerComp />
                    {index == shimmerArray.length - 1 ? <View style={{ marginBottom: 15 }} /> : null}
                </>
            )}
        />
    )
};



const ListManipulation = ({ navigation }: ListManipulationProps): JSX.Element => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lazyLoad, setLazyLoad] = useState<boolean>(false);
    const [isFrstTm, setIsFrstTm] = useState<boolean>(true);
    const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
    const ref = useRef<any>(null);

    const getProducts = () => {
        setLoading(true);
        fetch("https://dummyjson.com/products")
            .then(res => res.json())
            .then(json => {
                const newData: Product[] = [...json.products];
                newData.map((item: Product) => item.isSelected = false);
                setProducts(newData);
                setLoading(false);
            })
            .catch(err => {
                console.log("get products error ==>", err);
                setLoading(false);
                return;
            })
    };

    const loadMore = () => {
        if (products?.length < 100) {
            setLazyLoad(true);
            fetch(`https://dummyjson.com/products?skip=${products?.length}&limit=${10}`)
                .then(res => res.json())
                .then(json => {
                    const newData: Product[] = [...json.products];
                    newData.map((item: Product) => item.isSelected = false);
                    setProducts([...products, ...newData]);
                    setLazyLoad(false);
                }).catch(err => {
                    setLazyLoad(false);
                    console.log("load more error ==>", err);
                    return;
                });
        }
    };

    const handleLongPress = (id: number) => {
        if (isFrstTm) {
            setToggleCheckBox(true);
            const newData = [...products];
            newData.map((item, index) => index == id ? item.isSelected = !item.isSelected : item.isSelected);

            setProducts(newData);
            setIsFrstTm(false);
        };
    };

    const handleCheckBox = (id: number) => {
        const newData = [...products];
        newData.map((item, index) => index == id ? item.isSelected = !item.isSelected : item.isSelected);

        setProducts(newData);
    };

    const getSelectedCount = () => {
        const newData = [...products];
        const count = newData.filter(item => item.isSelected);
        return count.length;
    };

    const clearAll = () => {
        setToggleCheckBox(false);

        const newData: Product[] = [...products];
        newData.map((item: Product) => item.isSelected = false);
        setProducts(newData);

        setIsFrstTm(true);
    };

    const selectAll = () => {
        const newData: Product[] = [...products];
        newData.map((item: Product) => item.isSelected = true);
        setProducts(newData);
    };

    const leftSwipe = (): JSX.Element => (
        <TouchableOpacity style={styles.lSwipeWrap} onPress={() => ref.current.close()}>
            <Image style={styles.swipeIcon} source={require("../../assets/icons/pen.png")} />
        </TouchableOpacity>
    )

    const rightSwipe = (): JSX.Element => (
        <TouchableOpacity style={styles.rSwipeWrap} onPress={() => ref.current.close()}>
            <Image style={styles.swipeIcon} source={require("../../assets/icons/bin.png")} />
        </TouchableOpacity>
    )

    // console.log("products==>", products);

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <View style={styles.parent}>
            {toggleCheckBox && <View style={styles.chkBoxCont}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity style={{}} onPress={() => clearAll()}>
                        <Image style={{ width: 30, height: 30 }} source={require("../../assets/icons/remove.png")} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectAll} onPress={() => selectAll()} >
                        <Text style={{ fontSize: 12, color: "#3CCBA1", fontWeight: "bold" }}>Select All</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 15, fontSize: 20, color: "#3d4342" }}>{getSelectedCount()} Selected</Text>
            </View>
            }
            {
                loading ?
                    // <ActivityIndicator animating={loading} size={'large'} color={"#3CCBA1"} />
                    <CustomShimmerComponent len={30} />
                    :
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={products}
                            onEndReached={loadMore}
                            // ListFooterComponent={products.length < 100 ? <ActivityIndicator animating={lazyLoad} size={'large'} color={"#3CCBA1"} style={{ marginBottom: 20, marginTop: 10 }} /> : null}
                            ListFooterComponent={products.length < 100 ? <View style={{ marginBottom: 13 }}><BaseShimmerComp /></View> : null}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <GestureHandlerRootView >
                                    <Swipeable
                                        ref={ref}
                                        renderLeftActions={leftSwipe}
                                        renderRightActions={rightSwipe}
                                    >
                                        <TouchableOpacity
                                            style={styles.itemCont}
                                            onLongPress={() => handleLongPress(index)}
                                        >
                                            <View style={styles.leftBox}>
                                                <Image
                                                    style={{ width: 100, height: 100, borderRadius: 10, }}
                                                    source={{ uri: item?.thumbnail }}
                                                />
                                            </View>

                                            <View style={styles.rightBox}>
                                                <Text style={{ fontSize: 16, color: "#F19733", marginBottom: 7 }}>
                                                    {item?.title}
                                                </Text>
                                                <Text style={{ fontSize: 20, color: "#2EBB92" }}>₹{item?.price}</Text>
                                                <Text style={{ fontSize: 14, color: "#808886" }}>{item?.description}</Text>
                                            </View>

                                            {toggleCheckBox && <CheckBox
                                                disabled={false}
                                                value={item?.isSelected}
                                                onValueChange={(newValue) => handleCheckBox(index)}
                                            />}
                                        </TouchableOpacity>
                                    </Swipeable>

                                    {index === products.length - 1 ? <View style={{ marginBottom: 10 }} /> : null}
                                </GestureHandlerRootView>
                            )}
                        />
                    </View>
            }
        </View>
    )
}

export default ListManipulation;

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: "center"
    },
    itemCont: {
        backgroundColor: "#fff",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 10,
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    leftBox: {
        borderRadius: 10,
    },
    rightBox: {
        flex: 1,
        marginLeft: 15,
    },
    chkBoxCont: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        elevation: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    selectAll: {
        borderWidth: 1,
        borderColor: "#3CCBA1",
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    lSwipeWrap: {
        backgroundColor: "#62C1E5",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        marginLeft: 10,
        borderRadius: 12,
        marginTop: 10,
    },
    rSwipeWrap: {
        backgroundColor: "#62C1E5",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        marginRight: 10,
        borderRadius: 12,
        marginTop: 10,
    },
    swipeIcon: {
        width: 50,
        height: 50,
    },
});