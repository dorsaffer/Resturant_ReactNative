import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native'
import { color } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { Card, Button, Icon } from 'react-native-elements';
import { MailComposer } from 'expo';



class Contact extends Component {

  sendMail() {
    MailComposer.composeAsync({
      recipients: ['confusion@food.net'],
      subject: 'Enquiry',
      body: 'To whom it may concern:'
    })
  }


  render() {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
        <Card title="Contact information " titleStyle={{ textDecorationStyle: 'solid', fontWeight: 'bold' }} >
          <Text > 121, Clear Water Bay Road </Text>
          <Text>Clear Water Bay, Kowloon</Text>
          <Text> HONG KONG</Text>
          <Text>Tel: +852 1234 5678</Text>
          <Text>Fax: +852 8765 4321</Text>
          <Text>Email:confusion@food.net</Text>
          <Button
            title="Send Email"
            buttonStyle={{ backgroundColor: "#512DA8" }}
            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={this.sendMail}
          />
        </Card>
      </Animatable.View>

    );
  }
}

export default Contact;