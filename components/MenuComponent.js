import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import React, { Component } from 'react';
import { DISHES } from '../shared/dishes';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import Reservation from './ReservationComponent';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
	return {
		dishes: state.dishes
	}
}

class Menu extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	static navigationOptions = {
		title: 'Menu'
	};


	render() {

		const { navigate } = this.props.navigation;
		const renderMenuItem = ({ item, index }) => {

			return (

				<Animatable.View animation="fadeInRightBig" duration={2000}>
					<ListItem
						key={index}
						title={item.name}
						subtitle={item.description}
						onPress={() => navigate('DishDetail', { dishId: item.id })}
						hideChevron={true}
						leftAvatar={{ source: require('./images/uthappizza.png') }}
					/>
				</Animatable.View>

			);
		};


		if (this.props.dishes.isLoading) {
			return (
				<Loading />
			);
		}
		else if (this.props.dishes.errMess) {
			return (
				<View>
					<Text>{this.props.dishes.errMess}</Text>
				</View>
			);
		}
		else {
			return (
				<FlatList
					data={this.props.dishes.dishes}
					renderItem={renderMenuItem}
					keyExtractor={item => item.id.toString()}
				/>
			);
		}


	}
}


export default connect(mapStateToProps)(Menu);