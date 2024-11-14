import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Voice from '@react-native-voice/voice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../constants';

export default function HomeScreen() {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(true);
  const [result, setResult] = useState('');
 
  const speechStartHandler = e=> {
    console.log('speech start handler');
  };

  const speechEndHandler = e=> {
    setRecording(false);
    console.log('speech end handler');
  };
  const speechResultsHandler = e=> {
    console.log('Voice event:', e);
    const text= e.value[0];
    setResult(text);
  };
  const speechErrorHandler = e=> {
    console.log('Speech error handler:', e);
  };
  
  const startRecording = async ()=> {
    setRecording(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('Voice start error:', error);
    }
  };
  
  const stopRecording = async ()=> {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.log('Voice stop error:', error);
    }
  };
  
  const clear = () => {
    setMessages([]);
  };
  const stopSpeaking = () => {
    setSpeaking(false);
  };
  useEffect(() => {

    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults= speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;
  
     return()=>{
      Voice.destroy().then(Voice.removeAllListeners);
     }
  }, []);
  
  // console.log("Result:- ", result);
  
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/botcon.png')}
            style={{ width: wp(45), height: wp(45)}}
          />
        </View>

        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text style={{ fontSize: wp(6) }} className="text-blue-900 font-bold ml-1">
              Assistant
            </Text>
            <View style={{ height: hp(58) }} className="bg-neutral-200 rounded-3xl p-4">
              
              <ScrollView bounces={false} className="space-y-4" 
              showsVerticalScrollIndicator={false}>
                {
                  messages.map((message, index) => {
                    // Assistant's response on the left
                    if (message.role === 'assistant') {
                      if (message.content.includes('https')) {
                        return (
                          <View key={index} className="flex-row justify-start">
                            <View className="p-2 flex bg-green-300 rounded-2xl rounded-tl-none">
                              <Image
                                source={{ uri: message.content }}
                                className="rounded-2xl"
                                resizeMode="contain"
                                style={{ height: wp(60), width: wp(60) }}
                              />
                            </View>
                          </View>
                        );
                      } 
                      // Text response on the left
                      else {
                        return (
                          <View key={index} className="flex-row justify-start">
                            <View style={{ width: wp(70) }} className="bg-green-300 rounded-xl p-2 rounded-tl-none">
                              <Text style={{ fontSize: wp(4) }} className="text-black font-bold ml-1">
                                {message.content}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    } 
                    // User input on the right
                    else {   
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View style={{ width: wp(70) }} className="bg-blue-200 rounded-xl p-2 rounded-tr-none">
                            <Text style={{ fontSize: wp(4) }} className="text-black font-bold ml-1">
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  })
                }
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )
        }
         <View className="flex justify-center items-center">
         {
          recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/voiceload.gif')}
                style={{ width: hp(8), height: hp(8) }}
              />
            </TouchableOpacity>
          ) : (  
            <TouchableOpacity onPress={startRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/recordingicn.png')}
                style={{ width: hp(8), height: hp(8) }}
              />
            </TouchableOpacity>
          )
          }
          {messages.length > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(107, 114, 128)',
                borderRadius: 25,
                padding: 10,
                position: 'absolute',
                right: 40,
              }}
              onPress={clear}
            >
              <Text className="text-white font-bold">Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(255, 0, 0)',
                borderRadius: 25,
                padding: 10,
                position: 'absolute',
                left: 40,
              }}
              onPress={stopSpeaking}
            >
              <Text className="text-white font-bold">Stop</Text>
            </TouchableOpacity>
          )}
         </View>
      </SafeAreaView>
    </View>
  );
}
