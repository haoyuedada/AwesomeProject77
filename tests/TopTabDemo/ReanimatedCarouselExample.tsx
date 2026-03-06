import React, { useState, useRef } from "react";
import Carousel from "react-native-reanimated-carousel";
import { View, Text, Dimensions, StyleSheet } from "react-native";

const PAGE_HEIGHT = Dimensions.get("window").height;
const PAGE_WIDTH = Dimensions.get("window").width;

export default function ReanimatedCarouselExample() {

	return (
		<View style={{ flex: 1 }}>
			<Carousel
				width={PAGE_WIDTH}
				height={PAGE_HEIGHT / 2}
				data={[1,2,3,4]}
                loop={true}
                autoPlay
				renderItem={({ index }) => {
					return (
						<View
							key={index}
							style={{
								flex: 1 ,
                                borderWidth:1,
                                justifyContent: 'center',
                                backgroundColor:['yellow','pink','red','green'][index]
							}}
						>
							<Text style={{ fontSize: 20, color: "white" }}>{`slide${index + 1}`}</Text>
						</View>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	swiperView: {
		backgroundColor: "skyblue",
		justifyContent: "center",
		alignItems: "center"
	},
	optView: {
		flexDirection: "row",
		gap: 10,
		padding: 5
	}
});