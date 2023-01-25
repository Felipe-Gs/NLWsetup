import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, Alert } from "react-native";
import { api } from "../lib/axios";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import {generateRangeDatesFromYearStart} from '../utils/generate-range-between-dates'
import dayjs from "dayjs";


const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaraySizes = 18 * 7;
const amountOfDaysToFill = minimumSummaraySizes - datesFromYearStart.length
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

type SummaryProps = Array<{
    id: string
    date: string
    amount: number
    completed: number
}>
export function Home(){
    const [laoding, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps>([]);
    const {navigate} = useNavigation();

    async function fecthData() {
        try {
            setLoading(true);
            const response = await api.get('/summary');
            setSummary(response.data);

        } catch (error) {
            // console.log(error);
            Alert.alert('Ops', 'Não foi possível carregar os dados.')

        }finally{
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(()=>{
        fecthData()
    },[]));
    
    if(laoding){
        return (
            <Loading/>
        )
    }
    
    return(
        <View className='flex-1 bg-background px-8 pt-16'>
            <Header/>
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i)=>(
                        <Text key={`${weekDay}-${i}`}
                        className={'text-zinc-400 text-xl font-bold text-center mx-1'}
                        style={{width: DAY_SIZE}}
                        >
                            {weekDay}
                            
                        </Text>
                    ))
                }
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                {
                    summary  &&
                    <View className="flex-row flex-wrap">
                    { datesFromYearStart.map(date =>{
                        const dayWithHabits = summary.find(day=>{
                            return dayjs(date).isSame(day.date, 'day')
                        })
                        return(
                        <HabitDay
                            key={date.toISOString()}
                            date={date}
                            amountOfHabits={dayWithHabits?.amount}
                            amountCompleted={dayWithHabits?.completed}
                            onPress={() => navigate('habit', {date: date.toISOString()})}
                        />
                    )})}
                {
                    amountOfDaysToFill > 0 && Array
                        .from({length: amountOfDaysToFill})
                        .map((_, index) =>(
                            <View 
                            key={index}
                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                style={{width: DAY_SIZE, height: DAY_SIZE}}
                            />
                        ))
                }
                </View>}

            </ScrollView>
        </View>
    )
}