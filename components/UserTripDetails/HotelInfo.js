import { View, Text, FlatList, Image } from "react-native";
import React from "react";

export default function HotelInfo({ hotelData }) {
  return (
    <View
      style={{
        marginTop: -20,
      }}
    >
      <Text
        style={{
          fontFamily: "bold",
          fontSize: 15,
        }}
      >
        Hotel Recommendation
      </Text>
      <FlatList
        data={hotelData}
        style={{
          marginTop: 8,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginRight: 20,

              width: 180,
            }}
          >
            <Image
              source={require("./../../assets/images/photo.png")}
              style={{
                width: 180,
                height: 120,
                borderRadius: 15,
              }}
            ></Image>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                {item.hotelName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>*{item.rating}</Text>
                <Text>${item.price}/night</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
