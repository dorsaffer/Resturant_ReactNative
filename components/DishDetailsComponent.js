import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { postComment, postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})
const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    }, {
        dialogTitle: 'Share ' + title
    })
}

const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200)
        return true;
    else
        return false;
}

const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx > 200)
        return true;
    else
        return false;
};



function RenderDish(props) {
    const dish = props.dish;
    /*	handleViewRef = ref => this.view = ref;*/
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            if (recognizeComment(gestureState))
                return true;
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );
            if (recognizeComment(gestureState))
                props.openCommentForm();
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },

    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                {...panResponder.panHandlers} >
                <Card featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }} >
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name="pencil"
                        type="font-awesome"
                        color="#512DA8"
                        onPress={() => props.openCommentForm()}
                    />
                    <Icon
                        raised
                        reverse
                        name='share'
                        type='font-awesome'
                        color='#51D2A8'
                        onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    return (
        <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],
            showCommentForm: false,
            rating: 5,
            author: '',
            comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    setRating(rating) {
        this.setState({ rating });
    }

    setAuthor(author) {
        this.setState({ author });
    }

    setComment(comment) {
        this.setState({ comment });
    }

    openCommentForm() {
        this.setState({ showCommentForm: true });
    }

    resetCommentForm() {
        this.setState({ showCommentForm: false, rating: 5, author: '', comment: '' });
    }

    handleComment(dishId) {
        const { postComment } = this.props;
        const { author, comment, rating } = this.state;
        postComment(dishId, rating, author, comment);
        this.resetCommentForm();
    }


    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        const { showCommentForm } = this.state;
        return (
            <ScrollView>
                <RenderDish
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    openCommentForm={() => this.openCommentForm()}
                />
                <Modal

                    animationType="slide"
                    transparent={false}
                    visible={showCommentForm}
                    onDismiss={() => this.resetCommentForm()}
                    onRequestClose={() => this.resetCommentForm()}

                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Add Your Comment</Text>
                        <Rating
                            minValue={1}
                            count={5}
                            startingValue={5}
                            fractions={0}
                            showRating
                            onFinishRating={rating => this.setRating(rating)}
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={(
                                <Icon
                                    name="user"
                                    type="font-awesome"
                                />
                            )}
                            onChangeText={author => this.setAuthor(author)}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={(
                                <Icon
                                    name="comment"
                                    type="font-awesome"
                                />
                            )}
                            onChangeText={comment => this.setComment(comment)}
                        />
                        <Button
                            onPress={() => this.handleComment(dishId)}
                            color="#512DA8"
                            title="SUBMIT"
                        />
                        <Button
                            onPress={() => this.resetCommentForm()}
                            color="#6c757d"
                            title="CANCEL"
                        />
                    </View>
                </Modal>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);